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
  const [udid, setUdid] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showCode, setShowCode] = useState(true);
  const [showIosUdid, setShowIosUdid] = useState(false);
  const [showICloudUnlock, setShowICloudUnlock] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const checkCode = async () => {
    try {
      const response = await axios.get("https://api.starfiles.co/payments/check_code?check=true&code=" + codeInput);
      let data = response.data;
      setShowCode(false);
      if (data.status) {
        if (data.product === "signtunes_pro_1m" || data.product === "signtunes_pro_1y") {
          setShowIosUdid(true);
          setErrorMessage(null);
        } else if (data.product === "signtunes_unlock") {
          setShowICloudUnlock(true);
          setErrorMessage(null);
        } else {
          setErrorMessage("Unkown Product");
        }
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const submitIosUdid = async () => {
    try {
      const response = await axios.get(
        "https://api.starfiles.co/payments/check_code?code=" + codeInput + "&udid=" + udid
      );
      let data = response.data;
      setShowIosUdid(false);
      if (data.status) {
        setSuccessMessage(
          <>
            Download all these files. You won't be able to access this page again.
            <br />
            Distribution P12 (Recommended):{" "}
            <Link href={`https://starfiles.co/file/${data.certificates.distribution}`} className="text-blue-500">
              Download
            </Link>
            <br />
            Wildcard Mobileprovision:{" "}
            <Link href={`https://starfiles.co/file/${data.profiles.distribution_wildcard}`} className="text-blue-500">
              Download
            </Link>
            <br />
            Explicit Mobileprovision (Recommended):{" "}
            <Link href={`https://starfiles.co/file/${data.profiles.distribution_explicit}`} className="text-blue-500">
              Download
            </Link>
            <br />
            <br />
            Development P12:{" "}
            <Link href={`https://starfiles.co/file/${data.certificates.development}`} className="text-blue-500">
              Download
            </Link>
            <br />
            Wildcard Mobileprovision:{" "}
            <Link href={`https://starfiles.co/file/${data.profiles.development_wildcard}`} className="text-blue-500">
              Download
            </Link>
            <br />
            Explicit Mobileprovision (Recommended):{" "}
            <Link href={`https://starfiles.co/file/${data.profiles.development_explicit}`} className="text-blue-500">
              Download
            </Link>
          </>
        );
        setErrorMessage(null);
      } else {
        if (data.message === "Device on hold")
          setErrorMessage(
            <>
              Your device is on hold. Redo this process when your device is signed. You can check your device status by
              clicking <Link href="/device_status">here</Link>
            </>
          );
        else setErrorMessage(data.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const submitSerialNumber = async () => {
    try {
      const response = await axios.get(
        "https://api.starfiles.co/payments/check_code?code=" +
          codeInput +
          "&serial_number=" +
          serialNumber +
          "&email=" +
          email
      );
      let data = response.data;
      setShowICloudUnlock(false);
      if (data.status) {
        setSuccessMessage(<>Your device has been queued, you will be notified via email when it is ready.</>);
        setErrorMessage(null);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error(err.message);
    }
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
        <div className="block rounded-xl p-8 shadow-xl bg-bright dark:text-black lg:mx-96 mb-12 dark:text-gray-900">
          {showCode && (
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
                onClick={checkCode}
              >
                {translationList?.next}
              </button>
            </div>
          )}
          {showIosUdid && (
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
                onSubmit={submitIosUdid}
              >
                {translationList?.next}
              </button>
            </div>
          )}
          {showICloudUnlock && (
            <div id="icloud_unlock">
              <h3 className="text-xl font-semibold">Device Serial Number</h3>
              <input
                className="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full"
                placeholder="Serial Number"
                type="serial_number"
                id="serial_number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
              <input
                className="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full"
                placeholder="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="block text-center w-[100%] rounded-md bg-primary hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow mt-4 mb-8"
                type="submit"
                id="submit_serial_number"
                onSubmit={submitSerialNumber}
              >
                Next
              </button>
            </div>
          )}
          {successMessage && (
            <div id="success">
              <h3 className="text-xl font-semibold">Success</h3>
              <p id="success_message">{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div id="error">
              <h3 className="text-xl font-semibold">Error</h3>
              <p id="error_message">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Claim;
