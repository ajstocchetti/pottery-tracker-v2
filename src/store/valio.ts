import { proxy } from "valtio";
import { devtools } from "valtio/utils";

interface store {
  isLoggedIn: boolean;
  user: null | object;
  dbxAccount: null | any; // dropbox account
  pieceListSort: string;
  pieceListStatus: string;
}

const initialStore: store = {
  isLoggedIn: false,
  user: null,
  dbxAccount: null,
  pieceListSort: "updated_at",
  pieceListStatus: "ALL",
};

export const state = proxy(initialStore);
export const unsubscribe = devtools(state, {
  name: "Pottery Tracker State",
  enabled: true,
});
