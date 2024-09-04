"use client";
import { getTranslations } from "@/utils/getTranslation";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import TitleTags from "../components/Title";

function Claim({ searchParams }) {
  const { code } = searchParams;
  const [translationList, setTranslationList] = useState(null);
  const [codeInput, setCodeInput] = useState(code ? code : "");
  const [showNext, setShowNext] = useState(code ? code : false);
  const [udid, setUdid] = useState("");
  const [workingOnIt, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allDone, setAllDone] = useState(false);

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

  const submitIosUdid = async () => {
    console.log("submitting UDID");
    //Use regex to check if UDID is valid. ^([a-fA-F0-9]{40}|[0-9]{8}-[a-fA-F0-9]{16})$ for regex.
    if (!/^([a-fA-F0-9]{40}|[0-9]{8}-[a-fA-F0-9]{16})$/.test(udid)) {
      setError("Invalid UDID");
      return;
    }
    setLoading(true);
    fetch(`https://api2.starfiles.co/gift_code/${codeInput}?udid=${udid}`).then(async (r) => {
      if (r.status !== 200 && r.status !== 203) {
        let error;
        try {
          error = (await r.json()).message;
        } catch (e) {
          error = "Unknown error";
        }
        setError(`Server returned status code ${r.status}. Error: ${error}`);
        return;
      } else {
        const data = (await r.json()).result;
        if (!data.status) {
          setError(data.message);
          return;
        } else {
          setError("");
          setAllDone(true);
          setShowNext(false);
        }
      }
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <>
      <head>
        <TitleTags title="Claim" />
      </head>
      <Header searchParams={searchParams} />
      <div className="mx-5 md:mx-10 mt-5 py-8">
        <div className="px-4 py-4 mx-auto sm:px-6 md:px-12 lg:px-24 lg:py-8 flex flex-col w-full text-center">
          <h1 className="text-center font-bold sm:font-semibold lg:mb-0 mb-6 text-[21px] sm:text-3xl text-neutral-600 dark:text-white">
            {translationList?.claim_purchase}
          </h1>
        </div>
        <div className="block rounded-xl p-8 shadow-xl bg-bright lg:mx-96 mb-12 dark:text-gray-900">
          {!showNext && (
            <div id="code">
              <h3 className="text-xl font-semibold">Code</h3>
              <p>{translationList?.code_prompt}</p>
              <input
                className="rounded-lg border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full"
                placeholder="Code"
                type="text"
                id="code_input"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
              />
              <button
                className="block text-center w-[100%] rounded-md bg-primary hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow mt-4 mb-8"
                type="submit"
                id="check_code"
                onClick={() => {
                  if (!codeInput) {
                    setError("Please enter a code");
                    return;
                  }
                  setShowNext(true);
                }}
              >
                {translationList?.next}
              </button>
            </div>
          )}
          {showNext && (
            <div id="ios_udid">
              <h3 className="text-xl font-semibold">Device UDID</h3>
              <input
                className="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full"
                placeholder="iOS Device UDID"
                type="UDID"
                id="udid"
                value={udid}
                onChange={(e) => setUdid(e.target.value)}
              />
              <button
                className="block text-center w-[100%] rounded-md bg-primary hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow mt-4 mb-8"
                type="submit"
                id="submit_ios_udid"
                onClick={submitIosUdid}
                disabled={workingOnIt}
              >
                {workingOnIt ? translationList.Checking : !error ? translationList?.next : translationList.Retry}
              </button>
            </div>
          )}
          {allDone && (
            <div id="ready">
              <h3 className="text-xl font-semibold">You're all set!</h3>
              <p>
                {translationList?.all_set}
              </p>
            </div>
          )}
          {error && (
            <p className="text-red-500">
              {translationList?.error}: {error}
            </p>
          )}
          {showNext && (
            <span>
              <p className="text-sm">
                To get your UDID, please go <span className="underline text-blue-600"><Link href="https://udid.starfiles.co">here</Link></span>
              </p>
              <p className="text-sm">
                You are claiming the code: <strong>{codeInput}</strong>
              </p>
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default Claim;
