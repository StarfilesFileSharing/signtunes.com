"use client";
import cookie, { setCookie } from "@/utils/cookies";
import { getTranslations } from "@/utils/getTranslation";
import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import TitleTags from "../components/Title";

function PurchaseButton({ purchaseButton = <></>, redirect = null, searchParams, params }) {
  const { id } = searchParams;
  const { referral } = params;

  return (
    <form action="https://api.starfiles.co/payments/purchase" method="POST" className="flex justify-center">
      <input type="hidden" name="type" value="subscription" />
      <input
        type="hidden"
        name="item_name"
        value={`Signtunes 1 Year${id ? ` (${id.charAt(0).toUpperCase() + id.slice(1)})` : ""}`}
      />
      <input type="hidden" name="item_number" value={`signtunes_1y${id ? "_r_" + id + ")" : ""}`} />
      <input type="hidden" name="currency_code" value="USD" />

      {/* Set the terms of the regular subscription. */}
      <input
        type="hidden"
        name="price"
        value={`${
          id && id !== "wicked" ? +process.env.NEXT_PUBLIC_SIGNTUNES_PRICE - 1 : process.env.NEXT_PUBLIC_SIGNTUNES_PRICE
        }`}
      />
      <input type="hidden" name="p3" value="1" />
      <input type="hidden" name="t3" value="Y" />
      {redirect !== null && <input type="hidden" name="redirect" value={redirect} />}

      {/* Params */}
      <input type="hidden" name="device_name" value="Automatically Signed on Purchase" />
      <input
        type="hidden"
        name="request_parameters"
        value='[
            {
                "name":"udid",
                "type":"text",
                "placeholder":"UDID",
                "required": true,
                "text":"UDID (From https://udid.starfiles.co)",
                "link":{
                    "text":"Get your UDID",
                    "url":"https:\/\/udid.starfiles.co"
                }
            }
        ]'
      />
      <input type="hidden" name="cancel_return" value="https://signtunes.com" />
      <input type="hidden" name="return" value="https://signtunes.com/success" />

      <input type="hidden" name="platform_name" value="Signtunes" />
      <input type="hidden" name="platform_colour" value="#343a40" />
      <input type="hidden" name="platform_accent" value="#007bff" />
      <input type="hidden" name="platform_background" value="#e9ecef" />

      {(referral || document.referrer) && <input type="hidden" name="referral" value={referral ?? document.referrer} />}
      {purchaseButton}
    </form>
  );
}

function Purchase({ params, searchParams }) {
  const [translationList, setTranslationList] = useState(null);
  const { id } = searchParams;
  const { referral } = params;

  useEffect(() => {
    // Get Translations
    getTranslationList();
    // Save Referral
    saveReferral();
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

  // Save Referral
  const saveReferral = async () => {
    if (referral !== "purchase" && cookie("referral") == null) setCookie("referral", referral, 7);
    if (cookie("referral") !== referral && cookie("referral")) window.location.href = "/purchase/" + cookie("referral");
  };

  return (
    <>
      <head>
        <TitleTags title="Purchase Signtunes" />
      </head>
      <Header searchParams={searchParams} />
      <div className="mx-5 md:mx-10 mt-5">
        <div className="px-4 py-4 sm:px-6 md:px-12 lg:px-24 lg:py-8 flex flex-col mb-4 md:mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold dark:text-white">{translationList?.slogan_2}</h1>
          <h2 className="m-2 mb-0 md:text-xl text-neutral-600 dark:text-gray-200">{translationList?.slogan}</h2>
        </div>
        {/* <PurchaseButton
          purchaseButton={
            <button
              type="submit"
              className="mt-6 text-white bg-primary hover:bg-[#023E8A] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-4"
            >
              <span>{translationList?.purchase}</span>&nbsp;$
              {`${
                id && id !== "wicked"
                  ? +process.env.NEXT_PUBLIC_SIGNTUNES_PRICE - 1
                  : process.env.NEXT_PUBLIC_SIGNTUNES_PRICE
              }`}
              <span>{translationList?.per_year}</span>
            </button>
          }
        /> */}
        <div className="dark:text-gray-900 block rounded-xl p-8 shadow-xl bg-bright md:w-64 text-center m-auto">
          <h3 className="text-xl font-bold">Signtunes</h3>
          {/* <p className="text-lg">
            $
            {`${
              id && id !== "wicked"
                ? +process.env.NEXT_PUBLIC_SIGNTUNES_PRICE - 1
                : process.env.NEXT_PUBLIC_SIGNTUNES_PRICE
            }`}
            <span>{translationList?.per_year}</span>
          </p> */}
          <p className="mt-4 text-sm text-gray-300">
            {translationList && (
              <>
                <span>{translationList["1_device"]}</span>
                <br />
                <span>6 months access to signer</span>
                <br />
                <span>{translationList?.no_jailbreak}</span>
                <br />
                <span>{translationList["247_support"]}</span>
                <br />
                <span>{translationList?.starfiles_integration}</span>
                <br />
                <span>{translationList?.revoke_protection}</span>
                <br />
                <span>{translationList?.api_access}</span>
              </>
            )}
          </p>
          <a
            className="mt-6 text-white bg-primary hover:bg-[#023E8A] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-block"
            href="https://buy.stripe.com/cN29E90wo3WvdQQ6oz"
          >
            Install Now
          </a>
          <br />
          or
          <PurchaseButton
            params={params}
            searchParams={searchParams}
            purchaseButton={
              <button
                type="submit"
                className="text-white bg-primary hover:bg-[#023E8A] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Pay with Crypto
              </button>
            }
            redirect="crypto"
          />
        </div>
        <h1 className="mb-4 mt-8 mx-4 md:mt-16 md:mb-8 text-center font-bold leading-none tracking-tighter text-neutral-600 text-2xl md:text-4xl lg:text-5xl dark:text-white">
          Why Us?
        </h1>
        <div className="grid md:grid-cols-2 md:gap-x-40 gap-8 md:mx-20 pb-10">
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="h-10 w-10" fill="currentColor">
              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V318.1l-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z" />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.unlimited_installs}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.unlimited_installs_description}</p>
          </div>
          {/* <div className="block rounded-xl p-8 shadow-xl bg-bright">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-10 w-10"><path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/></svg>
                    <h3 className="mt-3 text-xl font-bold">Notification & VPN Support</h3>
                    <p className="mt-4 text-sm text-gray-200">Signtunes has increased entitlements allowing you to enjoy features many other stores don't have such as notification and vpn compatibility.</p>
                </div>  */}
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z" />
              <path
                fill-rule="evenodd"
                d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zm8.25-.75a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-3z"
                clip-rule="evenodd"
              />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.largest_library}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.largest_library_description}</p>
          </div>
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
              <path
                fill-rule="evenodd"
                d="M9.75 6.75h-3a3 3 0 00-3 3v7.5a3 3 0 003 3h7.5a3 3 0 003-3v-7.5a3 3 0 00-3-3h-3V1.5a.75.75 0 00-1.5 0v5.25zm0 0h1.5v5.69l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V6.75z"
                clip-rule="evenodd"
              />
              <path d="M7.151 21.75a2.999 2.999 0 002.599 1.5h7.5a3 3 0 003-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 01-4.5 4.5H7.151z" />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.custom_app}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.custom_app_description}</p>
          </div>
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-10 w-10" fill="currentColor">
              <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.7 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z" />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.revoke_protection}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.revoke_protection_description}</p>
          </div>
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-10 w-10" fill="currentColor">
              <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v47l-92.8 37.1c-21.3 8.5-35.2 29.1-35.2 52c0 56.6 18.9 148 94.2 208.3c-9 4.8-19.3 7.6-30.2 7.6H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm39.1 97.7c5.7-2.3 12.1-2.3 17.8 0l120 48C570 277.4 576 286.2 576 296c0 63.3-25.9 168.8-134.8 214.2c-5.9 2.5-12.6 2.5-18.5 0C313.9 464.8 288 359.3 288 296c0-9.8 6-18.6 15.1-22.3l120-48zM527.4 312L432 273.8V461.7c68.2-33 91.5-99 95.4-149.7z" />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.no_jailbreak}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.no_jailbreak_description}</p>
          </div>
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-10 w-10" fill="currentColor">
              <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.designed_with_security}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.designed_with_security_description}</p>
          </div>
          {translationList && (
            <div className="block rounded-xl p-8 shadow-xl bg-bright">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-10 w-10" fill="currentColor">
                <path d="M256 48C141.1 48 48 141.1 48 256v40c0 13.3-10.7 24-24 24s-24-10.7-24-24V256C0 114.6 114.6 0 256 0S512 114.6 512 256V400.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24H240c-26.5 0-48-21.5-48-48s21.5-48 48-48h32c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40V256c0-114.9-93.1-208-208-208zM144 208h16c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H144c-35.3 0-64-28.7-64-64V272c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64v48c0 35.3-28.7 64-64 64H352c-17.7 0-32-14.3-32-32V240c0-17.7 14.3-32 32-32h16z" />
              </svg>
              <h3 className="mt-3 text-xl font-bold">{translationList["247_chat"]}</h3>
              <p className="mt-4 text-sm text-gray-200">{translationList["247_chat_description"]}</p>
            </div>
          )}
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
              <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
              <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.sideloading_research}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.sideloading_research_description}</p>
          </div>
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path
                fill-rule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
                clip-rule="evenodd"
              />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.appdb_integration}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.appdb_integration_description}</p>
          </div>
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path
                fill-rule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
                clip-rule="evenodd"
              />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.gbox_integration}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.gbox_integration_description}</p>
          </div>
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path
                fill-rule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
                clip-rule="evenodd"
              />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.scarlet_support}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.scarlet_support_description}</p>
          </div>
          <div className="block rounded-xl p-8 shadow-xl bg-bright">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path
                fill-rule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
                clip-rule="evenodd"
              />
            </svg>
            <h3 className="mt-3 text-xl font-bold">{translationList?.esign_support}</h3>
            <p className="mt-4 text-sm text-gray-200">{translationList?.esign_support_description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Purchase;
