import _ from "lodash";
import { v4 as uuid } from "uuid";
import { snapshot } from "valtio";
import { dataFilePath } from "src/config";
import { state } from "src/store/valio";
import { Image, Piece } from "src/interfaces";
import { transform } from "./dbxTransforms";

interface DbxData {
  pieces: Piece[];
  images: Image[];
  version: number;
}

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

async function loadAllData(): Promise<DbxData | undefined> {
  try {
    const fileResponse = await getDbx().filesDownload({
      path: dataFilePath,
    });
    const fileContent = await blobToText(fileResponse.result.fileBlob);
    const data = JSON.parse(fileContent);
    const { pieces = [], images = [], version = 1 } = data;
    return transform({ pieces, images, version });
  } catch (err) {
    console.log("error loading data from dropbox");
    console.log(err);
  }
}

async function saveDataFile(data: DbxData) {
  const toSync = JSON.stringify(data);
  await getDbx().filesUpload({
    path: dataFilePath,
    contents: toSync,
    mute: true,
    mode: "overwrite",
  });
}

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

  const { pieces, images, version } = await loadAllData();
  if (isNew) pieces.push(toSave);
  else {
    const index = _.findIndex(pieces, { id: toSave.id });
    pieces[index] = toSave;
  }
  saveDataFile({ pieces, images, version });
}
