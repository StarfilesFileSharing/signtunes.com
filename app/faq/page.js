"use client";
import { getTranslations } from "@/utils/getTranslation";
import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import TitleTags from "../components/Title";

function FAQ({ searchParams }) {
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
      <Header searchParams={searchParams} />
      <div className="mx-5 md:mx-10 mt-5 py-8">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-8 flex flex-col w-full mb-2 text-center">
          <h1 className="text-center font-bold sm:font-semibold lg:mb-0 mb-6 text-[21px] sm:text-3xl text-neutral-600 dark:text-white">
            {translationList?.faq_long}
          </h1>
        </div>
        <div className="block px-8 pt-6 pb-4 shadow-xl bg-bright dark:text-gray-900 xl:mx-auto max-w-[800px] lg:mx-52 mb-12">
          <h3 className="text-xl font-medium">{translationList?.what_apps_can_install}</h3>
          <p className="text-md mb-4">{translationList?.apps_install_instructions}</p>
          <h3 className="text-xl font-medium">{translationList?.how_many_apps_can_install}</h3>
          <p className="text-md mb-4">{translationList?.how_many_apps_can_install_details}</p>
          <h3 className="text-xl font-medium">{translationList?.service_duration}</h3>
          <p className="text-md mb-4">{translationList?.service_duration_details_2}</p>
          <h3 className="text-xl font-medium">{translationList?.notifications_vpn_support}</h3>
          <p className="text-md mb-4">{translationList?.notifications_vpn_support_details}</p>
        </div>
      </div>
    </>
  );
}

export default FAQ;
