import { proxy } from "valtio";
import { devtools } from "valtio/utils";

interface store {
  isLoggedIn: boolean;
  user: null | object;
  pieceListSort: string;
  pieceListStatus: string;
}

const initialStore: store = {
  isLoggedIn: false,
  user: null,
  pieceListSort: "updated_at",
  pieceListStatus: "ALL",
};

export const state = proxy(initialStore);
const unsubscribe = devtools(state, {
  name: "Pottery Tracker State",
  enabled: true,
});
