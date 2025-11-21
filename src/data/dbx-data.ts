import { Dropbox, DropboxResponse, files } from "dropbox";
import _ from "lodash";
import { v4 as uuid } from "uuid";
import { snapshot } from "valtio";
import { dataFilePath, imagesDir } from "src/config";
import { AppConfig, Image, LazyOption, Piece } from "src/interfaces";
import { state } from "src/store/valio";
import { transform } from "./dbx-transforms";

interface DbxData {
  pieces: Piece[];
  images: Image[];
  appConfig: AppConfig;
  version: number;
}

const JSON_CACHE_TIMEOUT_MS = 180000; // 3 minutes
const CACHED_DATA: DbxData = {
  pieces: [],
  images: [],
  appConfig: {
    claybody: [],
    form: [],
    glazes: [],
    studio: [],
  },
  version: 0,
};
let DATA_LAST_LOADED: number = 0;
const IMAGE_SRC: { [fileName: string]: unknown } = {};
let IMAGE_PIECES: { [imgId: string]: string[] } = {};

export function logData() {
  console.log(CACHED_DATA);
}

export async function onLogin() {
  await loadAllData();
  await calculateImagePieces();
  await loadAppConfig();
}

/* DROPBOX */

function getDbx() {
  const { dbxInstance } = snapshot(state);
  return dbxInstance;
}

function blobToText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // @ts-expect-error
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
    return CACHED_DATA;
  } else {
    console.debug("loading json file from dropbox");
    const fileResponse = await getDbx().filesDownload({
      path: dataFilePath,
    });
    const fileContent = await blobToText(fileResponse.result.fileBlob);
    const data = JSON.parse(fileContent);
    const { pieces = [], images = [], appConfig = {}, version = 1 } = data;
    const transformed = transform({ pieces, images, version, appConfig });
    CACHED_DATA.pieces = transformed.pieces;
    CACHED_DATA.images = transformed.images;
    CACHED_DATA.appConfig = transformed.appConfig || defaultAppConfig();
    CACHED_DATA.version = transformed.version;
    DATA_LAST_LOADED = now;
    return CACHED_DATA;
  }
}

export async function saveData() {
  const now = Date.now();
  const toSync = JSON.stringify(CACHED_DATA);
  await getDbx().filesUpload({
    path: dataFilePath,
    contents: toSync,
    mute: true,
    mode: "overwrite",
  });
  DATA_LAST_LOADED = now;
}

export function clearDbxCache() {
  CACHED_DATA.pieces = [];
  CACHED_DATA.images = [];
  CACHED_DATA.appConfig = {
    claybody: [],
    form: [],
    glazes: [],
    studio: [],
  };
  DATA_LAST_LOADED = 0;
  IMAGE_PIECES = {};
  Object.keys(IMAGE_SRC).forEach((key) => {
    delete IMAGE_SRC[key];
  });
}

/* PIECES */

export async function loadPieces(
  ordering: string,
  status: string,
  textFilter: string = ""
): Promise<Piece[] | undefined> {
  const resp = await loadAllData();
  let pieces = resp?.pieces || [];
  if (!status.startsWith("_")) {
    pieces = pieces.filter((p) => p.status === status);
  } else if (status === "_IN_PROGRESS") {
    const skipStatuses: Array<string> = ["COMPLETE", "ABANDONED"];
    pieces = pieces.filter((p) => !skipStatuses.includes(p.status));
  }
  // if (form) pieces = pieces.filter((p) => p.form_type === form);
  // if (clay) pieces = pieces.filter((p) => p.clay_type === clay);
  if (textFilter) {
    const regx = new RegExp(textFilter, "i");
    pieces = pieces.filter(
      (p) => regx.test(p.notes) || regx.test(p.glaze) || regx.test(p.fate)
    );
  }
  let sortOrder: "asc" | "desc" = "asc";
  if (ordering[0] === "-") {
    ordering = ordering.substring(1);
    sortOrder = "desc";
  }
  return _.orderBy(pieces, ordering, sortOrder);
}

export async function loadPiece(pieceId: string): Promise<Piece | undefined> {
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
  if (isNew) CACHED_DATA.pieces.push(toSave);
  else {
    const index = _.findIndex(CACHED_DATA.pieces, { id: toSave.id });
    const numImages = CACHED_DATA.pieces[index].images.length;
    CACHED_DATA.pieces[index] = toSave;
    // if number of images has changed, then update all_pieces_added for all images
    if (numImages !== toSave.images.length) await updateImagePieceCount();
  }
  await saveData();
  return toSave;
}

export async function deletePiece(pieceId: string) {
  await loadAllData();
  _.remove(CACHED_DATA.pieces, { id: pieceId });
  await updateImagePieceCount();
  await saveData();
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
      strict_conflict: true,
    });

    const fileName = resp.result.name;
    CACHED_DATA.images.push({
      fileName: fileName,
      created_at: new Date().toISOString(),
      is_inspiration: false,
      number_pieces: 1,
      all_pieces_added: true,
      tags: [],
    });

    const pieceIndex = _.findIndex(CACHED_DATA.pieces, { id: pieceId });
    if (pieceIndex) {
      CACHED_DATA.pieces[pieceIndex].images.push(fileName);
    }
    await saveData();
  } catch (err) {
    console.warn("Error uploading file");
    console.warn(err);
  }
}

export async function saveImage(image: Image): Promise<Image | undefined> {
  await loadAllData();
  const index = _.findIndex(CACHED_DATA.images, { fileName: image.fileName });
  if (index < 0) {
    console.warn(`Could not find image to save with name ${image.fileName}`);
    return;
  }
  const previousPieces = CACHED_DATA.images[index].number_pieces;
  CACHED_DATA.images[index] = image;
  if (previousPieces !== image.number_pieces) {
    await updateImagePieceCount();
  }
  saveData(); // do not await, need to return image right away
  return CACHED_DATA.images[index]; // return the image from IMAGES, in case updateImagePieceCount was called and updated the object
}

export async function deleteImage(fileName: string) {
  try {
    const fullName = fullPath(fileName);
    await getDbx().filesDeleteV2({ path: fullName });
    await loadAllData();
    _.remove(CACHED_DATA.images, { fileName });
    CACHED_DATA.pieces.forEach((piece) => {
      piece.images = piece.images.filter((fn) => fn !== fileName);
    });
    await saveData();
  } catch (err) {
    console.warn("Error deleting image:", err);
  }
}

export function getPiecesForImage(fileName: string): string[] {
  if (!IMAGE_PIECES[fileName]) calculateImagePieces();
  return IMAGE_PIECES[fileName] || [];
}

function calculateImagePieces() {
  IMAGE_PIECES = {};
  CACHED_DATA.pieces.forEach((piece) => {
    piece.images.forEach((fileName) => {
      if (!IMAGE_PIECES[fileName]) IMAGE_PIECES[fileName] = [];
      IMAGE_PIECES[fileName].push(piece.id);
    });
  });
}

export async function updateImagePieceCount() {
  calculateImagePieces();
  CACHED_DATA.images = CACHED_DATA.images.map((image) => {
    const numPieces = (IMAGE_PIECES[image.fileName] || []).length;
    const full = numPieces >= image.number_pieces;
    return {
      ...image,
      all_pieces_added: full,
    };
  });
}

export async function checkImageDirectory(
  cursor: files.ListFolderResult["cursor"] | null = null,
  dbx: Dropbox = getDbx()
) {
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

  const resp: DropboxResponse<files.ListFolderResult> = await func;
  resp.result.entries.forEach((img) => {
    if (_.findIndex(CACHED_DATA.images, { fileName: img.name }) === -1) {
      // image not in store, add image
      const fileName = img.name;
      CACHED_DATA.images.push({
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
    await saveData();
  }
}

export async function getImageSrc(fileName: string, retryCount = 0) {
  if (IMAGE_SRC[fileName]) return IMAGE_SRC[fileName];
  try {
    const src = await getDbx().filesGetTemporaryLink({
      path: fullPath(fileName),
    });
    imageSrcTimeoutCount = 0; // reset error count on success
    const link = src?.result?.link;
    if (link) IMAGE_SRC[fileName] = link;
    return link;
  } catch (err: any) {
    console.error("Error loading image content");
    console.error(err);
    // The error thrown doesn't really match the dropbox documentation and its shape is inconsistent
    // only want to retry if we get a 429 (too many requests), which looks like a "TypeError"
    if (err.status === 409) {
      return; // image not found. should consider removing image from IMAGES
    }
    if (err.name === "TypeError" && retryCount < 3) {
      // the error coming back
      setTimeout(() => {
        getImageSrc(fileName, ++retryCount);
      }, 300 * ++imageSrcTimeoutCount);
    }
  }
}

/**********  --  App Config  --  **********/
function defaultAppConfig(): AppConfig {
  return {
    claybody: [],
    form: [],
    glazes: [],
    studio: [],
  };
}

export async function loadAppConfig(): Promise<AppConfig> {
  const resp = await loadAllData();
  const config = resp.appConfig;
  state.appConfig = config;
  return config;
}

async function saveAppConfig(config: AppConfig) {
  await loadAllData();
  CACHED_DATA.appConfig = config;
  await saveData();
  state.appConfig = config;
}

/*****  --  Clay Body: App Config  --  *****/
export async function addClayBodyItem(newValue: string = "New Clay Body") {
  const config = CACHED_DATA.appConfig;
  config.claybody.push(newValue);
  await saveAppConfig(config);
}

export async function editClayBodyItem(newValue: LazyOption, index: number) {
  const config = CACHED_DATA.appConfig;
  config.claybody[index] = newValue;
  await saveAppConfig(config);
}

export async function deleteClayBodyItem(index: number) {
  const config = CACHED_DATA.appConfig;
  config.claybody.splice(index, 1);
  await saveAppConfig(config);
}

/*****  --  Form: App Config  --  *****/
export async function addFormItem(newValue: string = "New Form") {
  const config = CACHED_DATA.appConfig;
  config.form.push(newValue);
  await saveAppConfig(config);
}

export async function editFormItem(newValue: LazyOption, index: number) {
  const config = CACHED_DATA.appConfig;
  config.form[index] = newValue;
  await saveAppConfig(config);
}

export async function deleteFormItem(index: number) {
  const config = CACHED_DATA.appConfig;
  config.form.splice(index, 1);
  await saveAppConfig(config);
}

/*****  --  Glazes: App Config  --  *****/
export async function addGlazeItem(newValue: string = "New Glaze") {
  const config = CACHED_DATA.appConfig;
  config.glazes.push(newValue);
  await saveAppConfig(config);
}

export async function editGlazeItem(newValue: string, index: number) {
  const config = CACHED_DATA.appConfig;
  config.glazes[index] = newValue;
  await saveAppConfig(config);
}

export async function deleteGlazeItem(index: number) {
  const config = CACHED_DATA.appConfig;
  config.glazes.splice(index, 1);
  await saveAppConfig(config);
}

/*****  --  Studio: App Config  --  *****/
export async function addStudioItem(newValue: string = "New Studio") {
  const config = CACHED_DATA.appConfig;
  config.studio.push(newValue);
  await saveAppConfig(config);
}

export async function editStudioItem(newValue: LazyOption, index: number) {
  const config = CACHED_DATA.appConfig;
  config.studio[index] = newValue;
  await saveAppConfig(config);
}

export async function deleteStudioItem(index: number) {
  const config = CACHED_DATA.appConfig;
  config.studio.splice(index, 1);
  await saveAppConfig(config);
}
