"use client";
import cookie, { setCookie } from "@/utils/cookies";
import { getTranslations } from "@/utils/getTranslation";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import TitleTags from "../components/Title";

function Signer({ searchParams }) {
  const router = useRouter();
  const { id } = searchParams;

  const [translationList, setTranslationList] = useState(null);

  const [ipa, setIpa] = useState("");
  const [udid, setUdid] = useState("");
  const [customBundleID, setCustomBundleID] = useState("");
  const [customAppName, setCustomAppName] = useState("");
  const [customVersion, setCustomVersion] = useState("");

  const [newsIcon, setNewsIcon] = useState(<></>);

  const [isRemoveUiSupportedDevicesChecked, setIsRemoveUiSupportedDevicesChecked] = useState(true);

  let calledOnce = false;

  useEffect(() => {
    if (!calledOnce) {
      // Global variable
      window.starfiles = { local: true, public: true };
      calledOnce = true;
      // Checks
      checks();
      // Get Translations
      getTranslationList();
      // Get Data
      getData();
    }
  }, []);

  // Checks
  const checks = async () => {
    if (cookie("udid") === null) {
      router.push("/purchase");
    }
    if (id) {
      router.push("/signer#" + id);
    }
  };

  // Get Translations
  const getTranslationList = async () => {
    try {
      const translations = await getTranslations();
      setTranslationList(translations);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Get Data
  const getData = async () => {
    try {
      if (typeof window.location.hash != "undefined" && window.location.hash.length > 1)
        setIpa(window.location.hash.replace("#", ""));

      function get(param) {
        let qs = window.location.search.split("+").join(" ");
        let params = {},
          tokens,
          re = /[?&]?([^=]+)=([^&]*)/g;

        while ((tokens = re.exec(qs))) {
          params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params[param];
      }

      // function cookie(name) {
      //   // let match = document.cookie.match(RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
      //   let match = localStorage.getItem(RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
      //   return match ? match[1] : null;
      // }
      setUdid(get("udid") ?? cookie("udid") ?? "");
      setNewsIcon(<img className="h-24 w-24 rounded-[24%]" src="//sts.st/i/5I6OvZzFTiLN" loading="lazy" />);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Save UDID
  async function saveUDID(value) {
    try {
      let match = /^[a-fA-F0-9]{40}|[0-9]{8}-[a-fA-F0-9]{16}$/.test(value);
      if (match) {
        const d = new Date();
        d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
        // document.cookie = "udid=" + this.value + ";expires=" + d.toUTCString() + ";path=/;domain=.signtunes.co";
        setCookie("udid", this.value);
        window.history.pushState("data" + this.value, "Signtunes", "/signer" + window.location.hash);
      }
    } catch (err) {
      console.log("err", err.message);
    }
  }

  return (
    <>
      <head>
        <TitleTags title="Signer" />
        <Script
          data-cfasync="false"
          async
          defer
          src="//cdn.jsdelivr.net/combine/gh/QuixThe2nd/Starfiles-JSDelivr@latest/js/functions.min.js,npm/jszip@3/dist/jszip.min.js,gh/QuixThe2nd/Starfiles-JSDelivr@latest/js/upload.min.js,npm/crypto-js@4/crypto-js.min.js"
        />
      </head>
      <Header searchParams={searchParams} />
      <div id="signer" className="mx-5 mb-12 mt-8">
        <div className="grid grid-cols-2 gap-4 pb-8">
          <div className="flex items-center col-span-2 md:col-span-1 justify-center md:flex-row flex-col">
            <div className="w-full md:w-5/12">
              <label
                for="uploaded_file"
                id="file-uploader"
                className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                    {/* {translationList?.upload_ipa} */}
                    Upload IPA
                  </p>
                </div>
                <input
                  id="uploaded_file"
                  type="file"
                  className="hidden"
                  onChange={() => {
                    console.log("changed");
                    let str =
                      "/signer-progress#?udid=" +
                      document.getElementById("udid").value +
                      (document.getElementById("custom_bundle_id").value.length
                        ? "&custom_bundle_id=" + document.getElementById("custom_bundle_id").value
                        : "") +
                      (document.getElementById("custom_app_name").value.length
                        ? "&custom_app_name=" + document.getElementById("custom_app_name").value
                        : "") +
                      (document.getElementById("custom_version").value.length
                        ? "&custom_version=" + document.getElementById("custom_version").value
                        : "") +
                      (document.getElementById("minimum_ios").value.length
                        ? "&minimum_ios=" + document.getElementById("minimum_ios").value
                        : "") +
                      (document.getElementById("default_bundle_id").checked ? "&default_bundle_id=true" : "") +
                      (document.getElementById("remove_plugins").checked ? "&remove_plugins=true" : "") +
                      (document.getElementById("remove_uisupporteddevices_check").checked
                        ? "&remove_uisupporteddevices_check=true"
                        : "") +
                      (document.getElementById("appletv").checked ? "&appletv=true" : "") +
                      (document.getElementById("remove_password_denylist").checked
                        ? "&remove_password_denylist=true"
                        : "") +
                      (document.getElementById("bypass_apple_arcade_drm").checked
                        ? "&bypass_apple_arcade_drm=true"
                        : "") +
                      (document.getElementById("enable_file_sharing").checked ? "&enable_file_sharing=true" : "") +
                      (document.getElementById("bypass_iap").checked ? "&bypass_iap=true" : "") +
                      (document.getElementById("remove_mobileprovision").checked
                        ? "&remove_mobileprovision" + "=true"
                        : "") +
                      (document.getElementById("bypass_sideload_detection_1").checked
                        ? "&bypass_sideload_detection_1=true"
                        : "") +
                      (document.getElementById("bypass_sideload_detection_2").checked
                        ? "&bypass_sideload_detection_2=true"
                        : "") +
                      (document.getElementById("bypass_sideload_detection_3").checked
                        ? "&bypass_sideload_detection_3=true"
                        : "") +
                      (document.getElementById("block_ads_1").checked ? "&block_ads_1=true" : "") +
                      (document.getElementById("block_ads_2").checked ? "&block_ads_2=true" : "") +
                      (document.getElementById("cheat_engine").checked ? "&cheat_engine=true" : "") +
                      (document.getElementById("force_enable_promotion").checked
                        ? "&force_enable_promotion=true"
                        : "") +
                      (document.getElementById("force_disable_promotion").checked
                        ? "&force_disable_promotion=true"
                        : "") +
                      (document.getElementById("remove_localisations").checked ? "&remove_localisations=true" : "") +
                      (document.getElementById("disable_url_schemes").checked ? "&disable_url_schemes=true" : "") +
                      (document.getElementById("force_dark_status_bar").checked ? "&force_dark_status_bar=true" : "") +
                      (document.getElementById("force_light_status_bar").checked
                        ? "&force_light_status_bar=true"
                        : "") +
                      (document.getElementById("force_auto_status_bar").checked ? "&force_auto_status_bar=true" : "") +
                      (document.getElementById("disable_forced_orientation").checked
                        ? "&disable_forced_orientation=true"
                        : "") +
                      (document.getElementById("disable_forced_fullscreen").checked
                        ? "&disable_forced_fullscreen=true"
                        : "") +
                      (document.getElementById("disable_forced_wifi").checked ? "&disable_forced_wifi=true" : "") +
                      (document.getElementById("disable_firebase_analytics_collection").checked
                        ? "&disable_firebase_analytics_collection=true"
                        : "") +
                      (document.getElementById("disable_facebook_analytics_collection").checked
                        ? "&disable_facebook_analytics_collection=true"
                        : "") +
                      (document.getElementById("disable_ios_requirement").checked
                        ? "&disable_ios_requirement=true"
                        : "") +
                      (document.getElementById("disable_background_execution").checked
                        ? "&disable_background_execution=true"
                        : "") +
                      (document.getElementById("certificate_type").value.length
                        ? "&certificate_type=" + document.getElementById("certificate_type").value
                        : "") +
                      (document.getElementById("provision_type").value.length
                        ? "&provision_type=" + document.getElementById("provision_type").value
                        : "") +
                      "&ipa=";
                    window.starfiles = { ...window.starfiles, local_path: str };
                    // setStarfiles((prev) => ({ ...prev, local_path: str }));
                    udid !== "" ? uploadFile(false) : alert("Please enter your UDID");
                  }}
                />
              </label>
              <p id="link_not_ready" style={{ display: "none" }} className="text-red-600">
                {translationList?.upload_not_complete}
              </p>
              <div id="preuploadoutput"></div>
              <div id="progress" style={{ display: "none" }}>
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-blue-700 dark:text-white" id="status"></span>
                  <span className="text-sm font-medium text-blue-700 dark:text-white" id="eta"></span>
                </div>
                <div id="progressContainer" className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"></div>
                <div className="flex justify-between my-1 text-xs">
                  <div id="upload_speed"></div>
                  <div id="remaining_size"></div>
                </div>
              </div>
              <div id="output"></div>
              <p className="font-semibold my-1 text-center">{translationList?.or}</p>
              <input
                className="rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full mb-4 dark:text-gray-700"
                placeholder="Starfiles ID"
                type="text"
                id="ipa"
                value={ipa}
                onChange={(e) => setIpa(e.target.value)}
              />
            </div>
            <div className="md:ml-4 md:mt-0 mt-4 w-full md:w-5/12 text-center">
              <div className="grid grid-cols-1">
                <input
                  className="rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full mb-3 dark:text-gray-700"
                  placeholder="UDID"
                  type="udid"
                  id="udid"
                  value={udid}
                  onChange={(e) => {
                    setUdid(e.target.value);
                    saveUDID(e.target.value);
                  }}
                  pattern="[a-fA-F0-9]{40}|[0-9]{8}-[a-fA-F0-9]{16}"
                />
                <select
                  className="rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full mb-3 dark:text-gray-700"
                  id="certificate_type"
                >
                  <option value="distribution">
                    {/* {translationList?.distr_cert} */}
                    {"{distr_cert}"}
                  </option>
                  <option value="development">
                    {/* {translationList?.dev_cert} */}
                    {"{dev_cert}"}
                  </option>
                </select>
                <select
                  className="rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full dark:text-gray-700"
                  id="provision_type"
                >
                  <option value="explicit">
                    {/* {translationList?.expl_profile} */}
                    {"{expl_profile}"}
                  </option>
                  <option value="wildcard">
                    {/* {translationList?.wild_profile} */}
                    {"{wild_profile}"}
                  </option>
                </select>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  className="text-white bg-primary hover:bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-0.5 md:mr-0"
                  id="sign_button"
                  onClick={async () => {
                    if (udid === "") {
                      alert("UDID missing");
                      return;
                    }
                    if (ipa === "") {
                      router.push(document.querySelector("#output a")?.getAttribute("href"));
                      return;
                    }

                    router.push(
                      "/signer-progress#?ipa=" +
                        ipa +
                        "&udid=" +
                        udid +
                        (customBundleID?.length ? "&custom_bundle_id=" + customBundleID : "") +
                        (customAppName?.length ? "&custom_app_name=" + customAppName : "") +
                        (customVersion?.length ? "&custom_version=" + customVersion : "") +
                        (document.getElementById("minimum_ios").value.length
                          ? "&minimum_ios=" + document.getElementById("minimum_ios").value
                          : "") +
                        (document.getElementById("default_bundle_id").checked ? "&default_bundle_id=true" : "") +
                        (document.getElementById("remove_plugins").checked ? "&remove_plugins=true" : "") +
                        (document.getElementById("remove_uisupporteddevices_check").checked
                          ? "&remove_uisupporteddevices_check=true"
                          : "") +
                        (document.getElementById("appletv").checked ? "&appletv=true" : "") +
                        (document.getElementById("remove_password_denylist").checked
                          ? "&remove_password_denylist=true"
                          : "") +
                        (document.getElementById("bypass_apple_arcade_drm").checked
                          ? "&bypass_apple_arcade_drm=true"
                          : "") +
                        (document.getElementById("enable_file_sharing").checked ? "&enable_file_sharing=true" : "") +
                        (document.getElementById("bypass_iap").checked ? "&bypass_iap=true" : "") +
                        (document.getElementById("remove_mobileprovision").checked
                          ? "&remove_mobileprovision=true"
                          : "") +
                        (document.getElementById("bypass_sideload_detection_1").checked
                          ? "&bypass_sideload_detection_1=true"
                          : "") +
                        (document.getElementById("bypass_sideload_detection_2").checked
                          ? "&bypass_sideload_detection_2=true"
                          : "") +
                        (document.getElementById("bypass_sideload_detection_3").checked
                          ? "&bypass_sideload_detection_3=true"
                          : "") +
                        (document.getElementById("block_ads_1").checked ? "&block_ads_1=true" : "") +
                        (document.getElementById("block_ads_2").checked ? "&block_ads_2=true" : "") +
                        (document.getElementById("cheat_engine").checked ? "&cheat_engine=true" : "") +
                        (document.getElementById("force_enable_promotion").checked
                          ? "&force_enable_promotion=true"
                          : "") +
                        (document.getElementById("force_disable_promotion").checked
                          ? "&force_disable_promotion=true"
                          : "") +
                        (document.getElementById("remove_localisations").checked ? "&remove_localisations=true" : "") +
                        (document.getElementById("disable_url_schemes").checked ? "&disable_url_schemes=true" : "") +
                        (document.getElementById("force_dark_status_bar").checked
                          ? "&force_dark_status_bar=true"
                          : "") +
                        (document.getElementById("force_light_status_bar").checked
                          ? "&force_light_status_bar=true"
                          : "") +
                        (document.getElementById("force_auto_status_bar").checked
                          ? "&force_auto_status_bar=true"
                          : "") +
                        (document.getElementById("disable_forced_orientation").checked
                          ? "&disable_forced_orientation=true"
                          : "") +
                        (document.getElementById("disable_forced_fullscreen").checked
                          ? "&disable_forced_fullscreen=true"
                          : "") +
                        (document.getElementById("disable_forced_wifi").checked ? "&disable_forced_wifi=true" : "") +
                        (document.getElementById("disable_firebase_analytics_collection").checked
                          ? "&disable_firebase_analytics_collection=true"
                          : "") +
                        (document.getElementById("disable_facebook_analytics_collection").checked
                          ? "&disable_facebook_analytics_collection=true"
                          : "") +
                        (document.getElementById("disable_ios_requirement").checked
                          ? "&disable_ios_requirement=true"
                          : "") +
                        (document.getElementById("disable_background_execution").checked
                          ? "&disable_background_execution=true"
                          : "") +
                        (document.getElementById("certificate_type").value.length
                          ? "&certificate_type=" + document.getElementById("certificate_type").value
                          : "") +
                        (document.getElementById("provision_type").value.length
                          ? "&provision_type=" + document.getElementById("provision_type").value
                          : "")
                    );
                  }}
                >
                  {translationList?.sign}
                </button>
                {/* <!--<button type="button" className="text-white bg-[#--><?php //echo $theme['primary'];?>
                        <!--] hover:bg-[#--><?php //echo $theme['secondary'];?>
                        <!--] font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-0.5 md:mr-0" id="appdb_sign_button" type="submit">AppDB</button> */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-full rounded-lg shadow-md bg-gray-100 dark:bg-gray-900">
              <div className="h-32 bg-blue-600 rounded-lg grid place-items-center" id="news_icon">
                {newsIcon}
              </div>
              <div className="p-5">
                <a href="/best_apps_to_sideload">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {" "}
                    Best Apps to Sideload!{" "}
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {translationList?.check_out_top_picks_2023}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="block pb-8">
            <h3 className="text-2xl font-semibold mb-4">{translationList?.optional_settings}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <input
                className="rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full dark:text-gray-700"
                placeholder={translationList?.custom_bundle_id}
                type="text"
                id="custom_bundle_id"
                value={customBundleID}
                onChange={(e) => setCustomBundleID(e.target.value)}
              />
              <input
                className="rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full dark:text-gray-700"
                placeholder={translationList?.custom_name}
                type="text"
                id="custom_app_name"
                value={customAppName}
                onChange={(e) => setCustomAppName(e.target.value)}
              />
              <input
                className="rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full dark:text-gray-700"
                placeholder={translationList?.custom_version}
                type="text"
                id="custom_version"
                value={customVersion}
                onChange={(e) => setCustomVersion(e.target.value)}
              />
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="default_bundle_id" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.default_bundle_id}</span>
              </label>
            </div>
          </div>
          <div className="block pb-8">
            <h3 className="text-2xl font-semibold mb-4">{translationList?.drm_bypass}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="remove_mobileprovision" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.remove_mobileprovision}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="bypass_sideload_detection_1" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.bypass_sideload_detection_sideloady}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="bypass_sideload_detection_2" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.bypass_sideload_detection_1}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="bypass_sideload_detection_3" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.bypass_sideload_detection_2}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="block_ads_1" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">Block Ads (1)</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="block_ads_2" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">Block Ads (2)</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="bypass_iap" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.bypass_iap}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="bypass_apple_arcade_drm" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.bypass_aa_drm}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="cheat_engine" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.cheat_engine}</span>
              </label>
            </div>
          </div>
          <div className="block pb-8">
            <h3 className="text-2xl font-semibold mb-4">{translationList?.user_interface}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="force_enable_promotion" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.force_enable_promotion}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="force_disable_promotion" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.force_disable_promotion}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="force_dark_status_bar" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.force_dark_status_bar}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="force_light_status_bar" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.force_light_status_bar}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="force_auto_status_bar" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.force_auto_status_bar}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="disable_forced_orientation" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.disable_forced_orientation}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="disable_forced_fullscreen" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.disable_forced_fullscreen}</span>
              </label>
            </div>
          </div>
          <div className="block pb-8">
            <h3 className="text-2xl font-semibold mb-4">{translationList?.privacy}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="disable_firebase_analytics_collection" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.disable_firebase_analytics_collection}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="disable_facebook_analytics_collection" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.disable_facebook_analytics_collection}</span>
              </label>
            </div>
          </div>
          <div className="block pb-8">
            <h3 className="text-2xl font-semibold mb-4">{translationList?.compatibility}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <input
                className="rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full dark:text-gray-700"
                placeholder="Minimum iOS"
                type="text"
                id="minimum_ios"
              />
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  id="remove_uisupporteddevices_check"
                  checked={isRemoveUiSupportedDevicesChecked}
                  onChange={() => setIsRemoveUiSupportedDevicesChecked((prev) => !prev)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.remove_uisupporteddevices_checks}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="appletv" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.apple_tv_mode}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="disable_ios_requirement" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.disable_ios_requirement}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="remove_plugins" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.remove_plugins}</span>
              </label>
            </div>
          </div>
          <div className="block pb-8">
            <h3 className="text-2xl font-semibold mb-4">{translationList?.power_saving}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="disable_forced_wifi" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.disable_forced_wifi}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="disable_background_execution" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.disable_background_execution}</span>
              </label>
            </div>
          </div>
          <div className="block pb-8">
            <h3 className="text-2xl font-semibold mb-4">{translationList?.other}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="enable_file_sharing" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.enable_file_sharing}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="remove_password_denylist" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.remove_password_denylist}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="remove_localisations" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.remove_localizations}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" className="sr-only peer" id="disable_url_schemes" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.remove_url_schemes}</span>
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  id="make_private"
                  onChange={
                    () =>
                      (window.starfiles = {
                        ...window.starfiles,
                        public: window?.starfiles?.public ? false : true,
                      })
                    // setStarfiles((prev) => ({ ...prev, public: !prev.public }
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span className="text-sm font-medium">{translationList?.make_ipa_private}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signer;
