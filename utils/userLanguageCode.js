import cookie from "./cookies";

export default function getUserLanguageCode() {
  if (cookie("lang")) return cookie("lang");
  if (navigator && navigator.languages) return navigator.languages[0].split("-")[0];
  if (navigator && navigator.language) return navigator.language.split("-")[0];
  return "en";
}
