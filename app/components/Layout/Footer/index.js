import { getTranslations } from "@/utils/getTranslation";
import { useEffect, useState } from "react";

function Footer() {
  const [translationList, setTranslationList] = useState(null);

  useEffect(() => {
    getTranslationList();
  }, []);

  // Get Translations
  const getTranslationList = async () => {
    try {
      const translations = await getTranslations("en-English.json");
      setTranslationList(translations);
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <a href="/discord" className="inline-block w-auto mb-1 p-2 text-l rounded-3xl text-white bg-[#7289da]">
          <i className="fab fa-discord"></i> Discord
        </a>
      </div>
      <p className="flex justify-center font-semibold text-3xl">Signtunes</p>
      <p className="mx-auto mt-6 max-w-md text-center text-gray-500">{translationList?.slogan}</p>
      <ul className="mt-6 flex justify-center gap-6 md:gap-8">
        <li>
          <a href="//starfiles.co/tos">{translationList?.tos}</a>
        </li>
        <li>
          <a href="//starfiles.co/privacy">{translationList?.privacy_policy}</a>
        </li>
        <li>
          <a href="//billing.stripe.com/p/login/bIY020fCZ0N40aA7ss">{translationList?.billing}</a>
        </li>
        <li>
          <a href="//translate.signtunes.com">{translationList?.translate}</a>
        </li>
      </ul>
      <button
        onClick={() => {
          setCookie("lang", "English (upside down)");
          window.location.reload();
        }}
        className="flex items-center gap-2 font-semibold m-auto mt-8"
      >
        {translationList?.help_translate}
      </button>
      <div id="translation-list" className="mt-2 flex justify-center gap-4 text-center flex-wrap"></div>
      <p className="mx-auto mt-3 max-w-md text-center text-gray-500">
        © 2020 - {new Date().getFullYear()} Copyright Signtunes
        <br />
        Product of <a href="//starfiles.co">Starfiles</a>
      </p>
    </footer>
  );
}

export default Footer;
