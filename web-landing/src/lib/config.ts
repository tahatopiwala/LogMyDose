const isLocalhost = typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const APP_URL = isLocalhost ? "http://localhost:3001" : "https://app.logmydose.com";

export function getAppUrl(path: string = "") {
  return `${APP_URL}${path}`;
}
