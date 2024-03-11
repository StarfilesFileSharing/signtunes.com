import axios from "axios";

export const getTranslations = async (translationName) => {
  try {
    const response = await axios.get(
      `https://raw.githubusercontent.com/QuixThe2nd/Signtunes-Translations/l10n_main/${translationName}`
    );
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
