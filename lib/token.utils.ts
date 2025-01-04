import Cookies from "js-cookie";

export function setAuthToken(token: string) {
  Cookies.set("savings_challenge__", token, { expires: 1 });
}

export function removeAuthToken() {
  Cookies.remove("savings_challenge__");
}

export function getAuthToken() {
  return Cookies.get("savings_challenge__");
}
