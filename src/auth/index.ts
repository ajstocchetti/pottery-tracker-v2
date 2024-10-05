import Cookies from "universal-cookie";
import { initialStore, state } from "src/store/valio";
import { clearDbxCache } from "src/data";

const cookies = new Cookies();
const tokenCookieName = "DBXACCSTOKEN";

export function setLoginCookie(token: string) {
  // on oauth callback, get expires_in=14400; I assume that's 4 hours (60*60*4 = 14400)
  const maxAge = 60 * 60 * 4; // in seconds
  cookies.set(tokenCookieName, token, { maxAge });
}

export function getLoginCookie() {
  return cookies.get(tokenCookieName);
}

export function clearLoginCookie() {
  return cookies.remove(tokenCookieName);
}

export function dbxLogin(dbxInstance: any, account: any) {
  state.isLoggedIn = true;
  state.dbxInstance = dbxInstance;
  state.user = { email: account?.result?.email };
}

export function logout() {
  clearDbxCache();
  clearLoginCookie();
  Object.entries(initialStore).forEach(([key, val]) => (state[key] = val));
  window.location.assign("/");
}
