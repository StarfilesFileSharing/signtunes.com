"use client";
import { getTranslations } from "@/utils/getTranslation";
import { useEffect, useState } from "react";
import TitleTags from "../components/Title";

function FAQ() {
  const [translationList, setTranslationList] = useState(null);

  useEffect(() => {
    // Get Translations
    getTranslationList();
  }, []);

  // Get Translations
  const getTranslationList = async () => {
    try {
      const translations = await getTranslations();
      setTranslationList(translations);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <head>
        <TitleTags title="Frequently Asked Questions" />
      </head>
      <div className="mx-5 md:mx-10 mt-5">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-8 flex flex-col w-full mb-12 text-center">
          <h1 className="text-4xl font-bold leading-none tracking-tighter text-neutral-600 dark:text-gray-200">
            {translationList?.faq_long}
          </h1>
        </div>
        <div className="block rounded-xl p-8 shadow-xl bg-bright dark:text-gray-900 lg:mx-96 mb-12">
          <h3 className="text-xl font-semibold">{translationList?.what_apps_can_install}</h3>
          <p className="text-lg mb-4">{translationList?.apps_install_instructions}</p>
          <h3 className="text-xl font-semibold">{translationList?.how_many_apps_can_install}</h3>
          <p className="text-lg mb-4">{translationList?.how_many_apps_can_install_details}</p>
          <h3 className="text-xl font-semibold">{translationList?.service_duration}</h3>
          <p className="text-lg mb-4">{translationList?.service_duration_details_2}</p>
          <h3 className="text-xl font-semibold">{translationList?.notifications_vpn_support}</h3>
          <p className="text-lg mb-4">{translationList?.notifications_vpn_support_details}</p>
        </div>
      </div>
    </>
  );
}

export default FAQ;
