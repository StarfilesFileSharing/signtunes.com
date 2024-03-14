"use client";
import { getTranslations } from "@/utils/getTranslation";
import axios from "axios";
import { useEffect, useState } from "react";
import TitleTags from "../components/Title";

function AppleTV() {
  const [translationList, setTranslationList] = useState(null);
  const [emailData, setEmailData] = useState(null);
  const [iosUdidData, setIosUdidData] = useState(null);
  const [tvosClicked, setTvosClicked] = useState(false);
  const [appDBClicked, setAppDbClicked] = useState(false);
  const [email, setEmail] = useState("");
  const [udid, setUdid] = useState("");
  const [tvos, setTvos] = useState("");

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
        <TitleTags title="Apple TV Signing" />
      </head>
      <div className="mx-5 md:mx-10 mt-5">
        <div className="px-4 py-4 mx-auto sm:px-6 md:px-12 lg:px-24 lg:py-8 flex flex-col w-full mb-12 text-center">
          <h1 className="text-4xl font-bold leading-none tracking-tighter text-neutral-600 dark:text-gray-200">
            Apple TV Signing
          </h1>
        </div>
        <div className="block rounded-xl p-8 shadow-xl bg-bright dark:text-black lg:mx-96 mb-12 dark:text-gray-900">
          {!emailData && (
            <div id="email_confirmation">
              <h3 className="text-xl font-semibold">Email</h3>
              <p>Please enter your email address. This is the email you want linked to AppDB.</p>
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
                id="check_email"
                onClick={async () => {
                  try {
                    const response = await axios.get(
                      "https://api.starfiles.co/device_enrolments/check_appdb_account?email=" + email
                    );
                    setEmailData(response.data);
                  } catch (err) {
                    console.error(err.message);
                  }
                }}
              >
                Next
              </button>
            </div>
          )}
          {emailData && !emailData?.device_found && (
            <div id="link_ios">
              <h3 className="text-xl font-semibold">Link iPhone or iPad</h3>
              <p>
                Before signing an Apple TV, an iOS device must first be linked to AppDB. Once you install this profile
                on your iOS device, refresh this page and resubmit your email.
              </p>
              <a
                className="block text-center w-[100%] rounded-md bg-primary hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow mt-4 mb-8"
                id="ios_profile"
                href={emailData?.profile ?? "#"}
              >
                Install Profile
              </a>
            </div>
          )}
          {emailData && !iosUdidData && emailData?.device_found && (
            <div id="ios_udid">
              <h3 className="text-xl font-semibold">Link iPhone or iPad</h3>
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
                onClick={async () => {
                  try {
                    const response = await axios.get(
                      "https://api.starfiles.co/device_enrolments/check_appdb_account?email=" +
                        email +
                        "&iphone_udid=" +
                        udid
                    );
                    console.log("test");
                    setIosUdidData(response.data);
                  } catch (err) {
                    console.error(err.message);
                  }
                }}
              >
                Next
              </button>
            </div>
          )}
          {iosUdidData && !tvosClicked && (
            <div id="link_tvos">
              <h3 className="text-xl font-semibold">Link Apple TV</h3>
              <ol className="my-2 space-y-1 list-decimal list-inside">
                <li>On your Apple TV, open the Settings app</li>
                <li>Navigate to "General", then "Privacy"</li>
                <li>Hover over "Share Apple TV Analytics" and click the pause/play button on your remote.</li>
                <li>Click "Add Profile", then enter the following URL:</li>
              </ol>
              <div className="flex items-center w-full p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 text-black dark:text-white">
                <div className="text-sm font-normal" id="tvos_profile">
                  {iosUdidData?.profile}
                </div>
              </div>
              <button
                className="block text-center w-[100%] rounded-md bg-primary hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow mt-4 mb-8"
                type="submit"
                id="tvos_profile_installed"
                onClick={() => setTvosClicked(true)}
              >
                Next
              </button>
            </div>
          )}
          {tvosClicked && !appDBClicked && (
            <div id="final">
              <h3 className="text-xl font-semibold">Finishing Up</h3>
              <p>
                Finally,{" "}
                <a href="/purchase" className="text-blue-400 font-bold">
                  purchase Signtunes
                </a>
                . Once Signtunes is purchased, enter your Apple TV's UDID below to import the certificate to AppDB.
              </p>
              <input
                className="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full"
                placeholder="Apple TV UDID"
                type="text"
                id="tvos_udid"
                value={tvos}
                onChange={(e) => setTvos(e.target.value)}
              />
              <button
                className="block text-center w-[100%] rounded-md bg-primary hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow mt-4 mb-8"
                type="submit"
                id="import_to_appdb"
                onClick={async () => {
                  try {
                    const response = await axios.get(
                      "https://api.starfiles.co/device_enrolments/appdb_certificate_import?udid=" + tvos
                    );
                    if (response.data) {
                      setAppDbClicked(true);
                    } else throw new Error("error");
                  } catch (err) {
                    console.error(err.message);
                    alert("Failed to import. Please contact support.");
                  }
                }}
              >
                Import
              </button>
            </div>
          )}
          {appDBClicked && (
            <div id="success">
              <h3 className="text-xl font-semibold">Apple TV Successfully Signed</h3>
              <p>
                Your Apple TV has been successfully signed. You can install apps via the "AppDB" button on Starfiles or
                through the AppDB UI.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AppleTV;
