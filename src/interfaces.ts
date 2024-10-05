export interface Image {
  // id: string;
  // image: string;
  fileName: string;
  is_inspiration: boolean;
  number_pieces: number;
  tags: string[];
  created_at: string;
  all_pieces_added: boolean;
}
export interface Piece {
  id: string;
  created_at: Date | null;
  updated_at: Date | null;
  date_thrown: Date | null;
  date_trimmed: Date | null;
  date_to_bisque: Date | null;
  date_to_glaze: Date | null;
  returned_from_bisque: boolean;
  returned_from_glaze: boolean;
  is_abandoned: boolean;
  form_type: string;
  clay_type: string;
  is_handbuilt: boolean;
  notes: string;
  glaze: string;
  fate: string;
  status: string;
  weight: string;
  images: Image[];
}
