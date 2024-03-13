import axios from "axios";
import cookie from "./cookies";
import getUserLanguageCode from "./userLanguageCode";

let translations = {};
export const getTranslations = async (getList = false) => {
  try {
    const contents = await axios.get(
      "https://api.github.com/repos/QuixThe2nd/Signtunes-Translations/contents/?ref=l10n_main"
    );

    let data = contents.data;

    if (translations.length > 0) return translations;

    const fileList = data.filter((item) => item.type === "file");
    if (getList) return fileList;

    for (let item of fileList) {
      if (
        !item.name.endsWith(".json") ||
        item.name === "en_source.json" ||
        item.name === "en-English (upside down).json"
      )
        continue;

      if (item.name.startsWith(getUserLanguageCode())) {
        let newTranslation = await axios.get(
          "https://raw.githubusercontent.com/QuixThe2nd/Signtunes-Translations/l10n_main/" + item.name
        );
        translations = newTranslation.data;
        return translations;
      }
    }
    if (!translations.length) {
      const defaultTranslation = await axios.get(
        "https://raw.githubusercontent.com/QuixThe2nd/Signtunes-Translations/l10n_main/en_source.json"
      );
      translations = defaultTranslation.data;
      return translations;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
