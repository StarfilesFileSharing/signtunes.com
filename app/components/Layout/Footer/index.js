"use client";
import cookie, { setCookie } from "@/utils/cookies";
import { getTranslations } from "@/utils/getTranslation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function Footer() {
  const [translationList, setTranslationList] = useState(null);
  const [translationButtons, setTranslationButtons] = useState([]);
  let initialRun = false;

  useEffect(() => {
    if (!initialRun) {
      // Get Translations
      getTranslationList();
      // Check Cookie
      checkCookie();
      initialRun = true;
    }
  }, []);

  // Get Translations
  const getTranslationList = async () => {
    try {
      const translations = await getTranslations();
      setTranslationList(translations);
      const translationButtons = await getTranslations(true);
      setTranslationButtons(translationButtons);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Check Cookie
  const checkCookie = () => {
    try {
      if (cookie("lang") === "English (upside down)") {
        var _jipt = [["project", "signtunes"]];
        var script = document.createElement("script");
        script.src = "//cdn.crowdin.com/jipt/jipt.js";
        document.head.appendChild(script);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 px-4 py-16 sm:px-6 lg:px-8 mt-12">
      <div className="text-center">
        <Link
          href={process.env.NEXT_PUBLIC_SIGNTUNES_DISCORD}
          className="inline-block w-auto mb-1 p-2 text-l rounded-3xl text-white bg-[#7289da]"
        >
          <i className="fab fa-discord mr-1" />
          Discord
        </Link>
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
      {translationButtons && Array.isArray(translationButtons) && translationButtons.length > 0 && (
        <div id="translation-list" className="mt-2 flex justify-center gap-4 text-center flex-wrap">
          {translationButtons?.map((item, index) => {
            if (
              !item.name.endsWith(".json") ||
              item.name === "en_source.json" ||
              item.name === "en-English (upside down).json"
            ) return null;
            else {
              let language_name = item.name.split("-")[1].replace(".json", "");
              return (
                <button
                  key={index}
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => {
                    setCookie("lang", item.name);
                    window.location.reload();
                  }}
                >
                  <img
                    loading="lazy"
                    src={`https://signtunes.com/localisations/${language_name}.svg`}
                    className="w-8"
                  />
                  {language_name}
                </button>
              );
            }
          })}
        </div>
      )}
      <p className="mx-auto mt-3 max-w-md text-center text-gray-500">
        © 2020 - {new Date().getFullYear()} Copyright Signtunes
        <br />
        Product of <a href="//starfiles.co">Starfiles</a>
      </p>
    </footer>
  );
}

export default Footer;
