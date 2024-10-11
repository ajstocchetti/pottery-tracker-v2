import { Image, Piece } from "src/interfaces";

interface DbxDataIn {
  pieces: any[];
  images: any[];
  version: number;
}

interface DbxData {
  pieces: Piece[];
  images: Image[];
  version: number;
}

export function transform(data: DbxData) {
  if (data.version < 2) data = toTwo(data);
  if (data.version < 3) data = toThree(data);
  return data;
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
