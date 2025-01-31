import { proxy } from "valtio";
import { devtools } from "valtio/utils";

interface store {
  isLoggedIn: boolean;
  user: null | { email: string };
  dbxInstance: null | any;
  pieceListSort: string;
  pieceListStatus: string;
  imageListFilter: string;
}

export const initialStore: store = {
  isLoggedIn: false,
  user: null,
  dbxInstance: null,
  pieceListSort: "updated_at",
  pieceListStatus: "NEEDS_TRIMMING",
  imageListFilter: "NEED_PIECES",
};

export const state = proxy(initialStore);
export const unsubscribe = devtools(state, {
  name: "Pottery Tracker State",
  enabled: true,
});
