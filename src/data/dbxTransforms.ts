import { Image, Piece } from "src/interfaces";

interface DbxData {
  pieces: Piece[];
  images: Image[];
  version: number;
}

export function transform(data: DbxData) {
  if (data.version < 2) data = toTwo(data);
  return data;
}

function toTwo(data: DbxData): DbxData {
  function getV2Status(piece: any): string {
    if (piece.is_abandoned) return "ABANDONED";
    if (piece.returned_from_glaze) return "COMPLETE";
    if (piece.date_to_glaze) return "AT_GLAZE";
    if (piece.returned_from_bisque) return "NEEDS_GLAZE";
    if (piece.date_to_bisque) return "AT_BISQUE";
    if (piece.date_trimmed || piece.is_hand_built) return "DRYING_OUT";
    return "NEEDS_TRIMMING";
  }
  const pieces = data.pieces.map((v1) => {
    const piece: Piece = {
      id: v1.id,
      // created_at: v1.created_at || new Date().toISOString(),
      // updated_at: v1.updated_at || new Date().toISOString(),
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
      images: [],
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
