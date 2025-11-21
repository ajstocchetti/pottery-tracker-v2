export interface Image {
  // id: string;
  // image: string;
  fileName: string;
  is_inspiration?: boolean; // deprecated
  number_pieces: number;
  tags: string[];
  created_at: string;
  all_pieces_added: boolean;
}
export interface Piece {
  id: string;
  created_at: Date | null;
  updated_at: Date | null;
  date_thrown: string | null;
  date_trimmed: string | null;
  date_to_bisque: string | null;
  date_to_glaze: string | null;
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
  images: string[];
  studio: string;
}
export interface SelectOption {
  label: string;
  value: string;
}
export type SelectOptions = SelectOption[];

export type LazyOption = SelectOption | string;

export interface AppConfig {
  claybody: LazyOption[];
  form: LazyOption[];
  glazes: string[];
  studio: LazyOption[];
}
