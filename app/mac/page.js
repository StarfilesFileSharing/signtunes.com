"use client";
import { getTranslations } from "@/utils/getTranslation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import TitleTags from "../components/Title";

function Mac({ searchParams }) {
  const [translationList, setTranslationList] = useState(null);
  const { UDID, chip } = searchParams;

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
        <TitleTags title="Mac Signing" />
      </head>
      <Header searchParams={searchParams} />
      <div className="mx-5 md:mx-10 mt-5">
        <div className="px-4 py-4 mx-auto sm:px-6 md:px-12 lg:px-24 lg:py-8 flex flex-col w-full mb-12 text-center">
          <h1 className="text-4xl font-bold leading-none tracking-tighter text-neutral-600 dark:text-gray-200">
            <span>{translationList?.mac_udid_grabber}</span>
          </h1>
        </div>
        <div className="block rounded-xl p-8 shadow-xl bg-bright dark:text-black lg:mx-96 mb-12 dark:text-gray-900">
          {!UDID ? (
            <div>
              <h3 className="text-xl font-semibold">
                <span>{translationList?.get_udid}</span>
              </h3>
              <p>{translationList?.mac_terminal_script}</p>
              <div className="mockup-code mt-4 text-left">
                <pre className="flex" data-prefix="$">
                  <code>eval `curl https://signtunes.com/get_udid`</code>
                </pre>
              </div>
            </div>
          ) : (
            <>
              {chip?.includes("intel") || !chip?.includes("apple") ? (
                <div>
                  <h3 className="text-xl font-semibold">Device Incompatible</h3>
                  <p>Your Mac doesn't seem to use Apple Silicon.</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold">Continue</h3>
                  <p>Please ensure your Mac is using an Apple Silicon chip.</p>
                  <p>
                    Finally,{" "}
                    <Link href="/purchase" className="text-blue-400 font-bold">
                      Purchase Signtunes
                    </Link>
                    . Your Mac's UDID is {UDID}.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Mac;
