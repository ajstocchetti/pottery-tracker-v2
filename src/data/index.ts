import _ from "lodash";
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

export async function loadPieces(
  ordering: string,
  status: string
): Promise<Piece[] | undefined> {
  const resp = await loadAllData();
  let pieces = resp?.pieces || [];
  if (status !== "ALL") pieces = pieces.filter((p) => p.status === status);
  return _.sortBy(pieces, ordering);
}

export async function savePieces() {}
export async function savePiece() {}
