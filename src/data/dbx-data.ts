import _ from "lodash";
import { v4 as uuid } from "uuid";
import { snapshot } from "valtio";
import { dataFilePath, imagesDir } from "src/config";
import { state } from "src/store/valio";
import { Image, Piece } from "src/interfaces";
import { transform } from "./dbxTransforms";

const JSON_CACHE_TIMEOUT_MS = 180000; // 3 minutes
let PIECES: Piece[] = [];
let IMAGES: Image[] = [];
let VERSION: number = 3;
let DATA_LAST_LOADED: number = 0;
const IMAGE_SRC: { [fileName: string]: unknown } = {};

interface DbxData {
  pieces: Piece[];
  images: Image[];
  version: number;
}

/* DROPBOX */

function getDbx() {
  const { dbxInstance } = snapshot(state);
  return dbxInstance;
}

function blobToText(blob: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(blob);
  });
}

export async function loadAllData(): Promise<DbxData> {
  const now = Date.now();
  if (now - DATA_LAST_LOADED < JSON_CACHE_TIMEOUT_MS) {
    console.debug("using cached json file");
    // data was loaded within the last 5 minutes, return cached data
    return { pieces: PIECES, images: IMAGES, version: VERSION };
  } else {
    console.debug("loading json file from dropbox");
    const fileResponse = await getDbx().filesDownload({
      path: dataFilePath,
    });
    const fileContent = await blobToText(fileResponse.result.fileBlob);
    const data = JSON.parse(fileContent);
    const { pieces = [], images = [], version = 1 } = data;
    const transformed = transform({ pieces, images, version });
    PIECES = transformed.pieces;
    IMAGES = transformed.images;
    VERSION = transformed.version;
    DATA_LAST_LOADED = now;
    return transformed;
  }
}

async function saveDataFile(data: DbxData) {
  const now = Date.now();
  const toSync = JSON.stringify(data);
  await getDbx().filesUpload({
    path: dataFilePath,
    contents: toSync,
    mute: true,
    mode: "overwrite",
  });
  PIECES = data.pieces;
  IMAGES = data.images;
  VERSION = data.version;
  DATA_LAST_LOADED = now;
}

export function saveData() {
  return saveDataFile({
    pieces: PIECES,
    images: IMAGES,
    version: VERSION,
  });
}

export function clearDbxCache() {
  PIECES = [];
  IMAGES = [];
  VERSION = 3;
  DATA_LAST_LOADED = 0;
  Object.keys(IMAGE_SRC).forEach((key) => {
    delete IMAGE_SRC[key];
  });
}

/* PIECES */

export async function loadPieces(
  ordering: string,
  status: string
): Promise<Piece[] | undefined> {
  const resp = await loadAllData();
  let pieces = resp?.pieces || [];
  if (status !== "ALL") pieces = pieces.filter((p) => p.status === status);
  return _.sortBy(pieces, ordering);
}

export async function loadPiece(pieceId: string) {
  const data = await loadAllData();
  const pieces = data?.pieces || [];
  return _.find(pieces, { id: pieceId });
}

export async function savePiece(
  piece: Piece,
  isNew: boolean = false
): Promise<Piece | undefined> {
  function getStatus(piece: Piece): string {
    if (piece.is_abandoned) return "ABANDONED";
    if (piece.returned_from_glaze) return "COMPLETE";
    if (piece.date_to_glaze) return "AT_GLAZE";
    if (piece.returned_from_bisque) return "NEEDS_GLAZE";
    if (piece.date_to_bisque) return "AT_BISQUE";
    if (piece.date_trimmed || piece.is_handbuilt) return "DRYING_OUT";
    return "NEEDS_TRIMMING";
  }
  const toSave = {
    ...piece,
    updated_at: new Date(),
    status: getStatus(piece),
  };
  if (isNew) {
    toSave.id = uuid();
    toSave.created_at = toSave.updated_at;
  }

  await loadAllData();
  if (isNew) PIECES.push(toSave);
  else {
    const index = _.findIndex(PIECES, { id: toSave.id });
    const numImages = PIECES[index].images.length;
    PIECES[index] = toSave;
    // if number of images has changed, then update all_pieces_added for all images
    if (numImages !== toSave.images.length) await updateImagePieceCount();
  }
  await saveData();
  return toSave;
}

export async function deletePiece(pieceId: string) {
  await loadAllData();
  _.remove(PIECES, { id: pieceId });
  saveData();
}

/* IMAGES */
let imageSrcTimeoutCount = 0;

const fullPath = (fileName: string): string => `${imagesDir}/${fileName}`;

export async function loadImages(
  filterType: string = "NEED_PIECES"
): Promise<Image[]> {
  const resp = await loadAllData();
  let images = resp.images;
  switch (filterType) {
    case "NEED_PIECES":
      images = images.filter(
        (img) => !img.is_inspiration && !img.all_pieces_added
      );
      break;
    case "FULL":
      images = images.filter(
        (img) => !img.is_inspiration && img.all_pieces_added
      );
      break;
    case "INSPIRATION":
      images = images.filter((img) => img.is_inspiration);
      break;
    case "ALL":
      break;
    default:
      console.warn(`Unknown image list filter option ${filterType}`);
  }

  return _.sortBy(images, "created_at");
}

export async function uploadImage(fileInfo: File, pieceId: string) {
  try {
    const sourceName = fileInfo.name;
    const resp = await getDbx().filesUpload({
      path: fullPath(sourceName),
      contents: fileInfo,
      autorename: true, // have dropbox rename if file exists
      mute: true,
    });

    const fileName = resp.result.name;
    IMAGES.push({
      fileName: fileName,
      created_at: new Date().toISOString(),
      is_inspiration: false,
      number_pieces: 1,
      all_pieces_added: true,
      tags: [],
    });

    const pieceIndex = _.findIndex(PIECES, { id: pieceId });
    if (pieceIndex) {
      PIECES[pieceIndex].images.push(fileName);
    }
    saveData();
  } catch (err) {
    console.warn("Error uploading file");
    console.warn(err);
  }
}

export async function saveImage(image: Image): Promise<Image | undefined> {
  await loadAllData();
  const index = _.findIndex(IMAGES, { fileName: image.fileName });
  if (index < 0) {
    console.warn(`Could not find image to save with name ${image.fileName}`);
    return;
  }
  const previousPieces = IMAGES[index].number_pieces;
  IMAGES[index] = image;
  if (previousPieces !== image.number_pieces) {
    await updateImagePieceCount();
  }
  saveData(); // do not await, need to return image right away
  return IMAGES[index]; // return the image from IMAGES, in case updateImagePieceCount was called and updated the object
}

export async function deleteImage(fileName: string) {
  try {
    const fullName = fullPath(fileName);
    await getDbx().filesDeleteV2({ path: fullName });
    await loadAllData();
    _.remove(IMAGES, { fileName });
    PIECES.forEach((piece) => {
      piece.images = piece.images.filter((fn) => fn !== fileName);
    });
    saveData();
  } catch (err) {
    console.warn("Error deleting image:", err);
  }
}

export async function updateImagePieceCount() {
  const images: { [imgId: string]: number } = {};
  PIECES.forEach((piece) => {
    piece.images.forEach((fileName) => {
      if (!images[fileName]) images[fileName] = 0;
      images[fileName] = images[fileName] + 1;
    });
  });
  IMAGES = IMAGES.map((image) => {
    const numPieces = images[image.fileName] || 0;
    const full = numPieces >= image.number_pieces;
    return {
      ...image,
      all_pieces_added: full,
    };
  });
}

export async function checkImageDirectory(cursor = null, dbx = getDbx()) {
  let func;
  if (cursor) {
    func = dbx.filesListFolderContinue({ cursor });
  } else {
    await loadAllData(); // refresh data before starting
    func = dbx.filesListFolder({
      path: imagesDir,
      recursive: false,
    });
  }

  const resp = await func;
  resp.result.entries.forEach((img) => {
    if (_.findIndex(IMAGES, { fileName: img.name }) === -1) {
      // image not in store, add image
      const fileName = img.name;
      IMAGES.push({
        fileName,
        created_at: new Date().toISOString(),
        is_inspiration: false,
        number_pieces: 1,
        all_pieces_added: false,
        tags: [],
      });
    }
  });

  if (resp.result.has_more) {
    return checkImageDirectory(resp.result.cursor, dbx);
  } else {
    saveData();
  }
}

export async function getImageSrc(fileName: string) {
  if (IMAGE_SRC[fileName]) return IMAGE_SRC[fileName];
  try {
    const src = await getDbx().filesGetTemporaryLink({
      path: fullPath(fileName),
    });
    imageSrcTimeoutCount = 0; // reset error count on success
    const link = src?.result?.link;
    if (link) IMAGE_SRC[fileName] = link;
    return link;
  } catch (err) {
    console.error("Error loading image content");
    console.error(err);
    // TODO: only retry if its a HTTP 409 error
    setTimeout(() => {
      getImageSrc(fileName);
    }, 300 * ++imageSrcTimeoutCount);
  }
}
