// @ts-nocheck
import { AppConfig, Image, Piece } from "src/interfaces";

interface DbxDataIn {
  pieces: any[];
  images: any[];
  version: number;
  appConfig: AppConfig;
}

interface DbxData {
  pieces: Piece[];
  images: Image[];
  appConfig: AppConfig;
  version: number;
}

export function transform(data: DbxData) {
  if (data.version < 2) data = toTwo(data);
  if (data.version < 3) data = toThree(data);
  if (data.version < 4) data = toFour(data);
  if (data.version < 4.1) data = porcelainTypos(data);
  if (data.version < 5) data = emptyConfig(data);
  if (data.version < 5.1) data = addStudio(data);
  return data;
}

function addStudio(data: DbxData): DbxData {
  const pieces: Piece[] = data.pieces.map((piece) => {
    const p = { studio: "", ...piece };
    return p;
  });
  return {
    pieces: pieces,
    images: data.images,
    appConfig: data.appConfig,
    version: 5.1,
  };
}

function emptyConfig(data: DbxData): DbxData {
  const initialConfig = {
    claybody: [
      { label: "Porcelain", value: "PORCELAIN" },
      { label: "B-Clay", value: "B_CLAY" },
      { label: "306 Brown Stoneware", value: "306" },
      { label: "White Stoneware", value: "WHITE_STONEWARE" },
      { label: "Reclaim", value: "RECLAIM" },
      { label: "Gumbo", value: "GUMBO" },
      { label: "Other", value: "OTHER" },
    ],
    form: [
      { label: "Bowl", value: "BOWL" },
      { label: "Mug", value: "MUG" },
      { label: "Vase", value: "VASE" },
      { label: "Teapot", value: "TEAPOT" },
      { label: "Other", value: "OTHER" },
    ],
    glazes: [
      "Shaner Clear (#1)",
      "Shaner White (#2)",
      "Antique White (#3)",
      "Matte White (#4)",
      "Yellow Salt (#5)",
      "Gustin Shino (#6)",
      "Lau Shino (#7)",
      "Blue Celedon (#8)",
      "Green Celedon (#9)",
      "Coleman Apple Green (#10)",
      "Josh Green (#11)",
      "Reitz Green (#12)",
      "Josh Blue (#13)",
      "Aviva Blue (#14)",
      "Lavender (#15)",
      "Rutile Blue (#16)",
      "Iron Red (#17)",
      "Temmoku (#18)",
      "Matte Black (#19)",
      "Chun Blue (#20)",
      "Cohen's Red (#21)",
      "Amber Celedon (#22)",
      "Tom's Purple (#23)",
      "Tea Dust (#24)",
      "Galaxy Black (#25)",
    ],
    studio: ["AlleyCat", "Lillstreet"],
  };
  return {
    appConfig: data.appConfig || initialConfig,
    pieces: data.pieces,
    images: data.images,
    version: 5,
  };
}

function porcelainTypos(data: DbxData): DbxData {
  const pieces: Piece[] = data.pieces.map((piece) => {
    const p = { ...piece };
    if (p.clay_type === "PORCELIN") p.clay_type = "PORCELAIN";
    return p;
  });
  return {
    pieces: pieces,
    images: data.images,
    version: 4.1,
  };
}

function toFour(data: DbxData): DbxData {
  const pieces: Piece[] = data.pieces.map((piece) => {
    const p = { ...piece };
    p.clay_type = p.clay_type.toUpperCase();
    if (p.clay_type === "B-CLAY") p.clay_type = "B_CLAY";
    if (p.clay_type === "WHITE-STONEWARE") p.clay_type = "WHITE_STONEWARE";
    p.form_type = p.form_type.toUpperCase();
    return p;
  });
  return {
    pieces: pieces,
    images: data.images,
    version: 4,
  };
}

function toThree(data: DbxDataIn): DbxData {
  const images: Image[] = data.images.map((img) => {
    return {
      fileName: img.fileName,
      created_at: img.addedAt,
      is_inspiration: (img.tags || []).includes("inspiration"),
      number_pieces: img.numPieces || 1,
      tags: img.tags || [],
      all_pieces_added: img.isFullAssoc,
    };
  });
  return {
    pieces: data.pieces,
    images: images,
    version: 3,
  };
}

function toTwo(data: DbxDataIn): DbxData {
  function getV2Status(piece: any): string {
    if (piece.is_abandoned) return "ABANDONED";
    if (piece.returned_from_glaze) return "COMPLETE";
    if (piece.date_to_glaze) return "AT_GLAZE";
    if (piece.returned_from_bisque) return "NEEDS_GLAZE";
    if (piece.date_to_bisque) return "AT_BISQUE";
    if (piece.date_trimmed || piece.is_handbuilt) return "DRYING_OUT";
    return "NEEDS_TRIMMING";
  }
  const pieces = data.pieces.map((v1, index) => {
    const piece: Piece = {
      id: v1.id,
      created_at: v1.created_at || new Date(1727758800000 + 100 * index),
      // 1727758800000 -> October 1, 2024
      // then add a 100ms per item so that the created_at order matches the array order
      updated_at: v1.updated_at || new Date(),
      date_thrown: v1.date_thrown,
      date_trimmed: v1.date_trimmed,
      date_to_bisque: v1.date_to_bisque,
      date_to_glaze: v1.date_to_glaze,
      returned_from_bisque: v1.returned_from_bisque,
      returned_from_glaze: v1.returned_from_glaze,
      is_abandoned: v1.ruined,
      form_type: v1.type,
      clay_type: v1.clay_type,
      is_handbuilt: v1.is_hand_built,
      notes: v1.notes,
      glaze: v1.glaze,
      fate: v1.fate,
      weight: v1.clay_weight,
      images: v1.images,
      status: "migrating",
    };
    piece.status = getV2Status(piece);
    return piece;
  });
  return {
    pieces: pieces,
    images: data.images,
    version: 2,
  };
}
