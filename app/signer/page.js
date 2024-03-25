"use client";
import cookie from "@/utils/cookies";
import { getTranslations } from "@/utils/getTranslation";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TitleTags from "../components/Title";

function Signer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [translationList, setTranslationList] = useState(null);

  const [showLinksNotReady, setShowLinksNotReady] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const [ipa, setIpa] = useState("");
  const [udid, setUdid] = useState("");
  const [customBundleID, setCustomBundleID] = useState("");
  const [customAppName, setCustomAppName] = useState("");
  const [customVersion, setCustomVersion] = useState("");

  let calledOnce = false;

  useEffect(() => {
    if (!calledOnce) {
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

      function cookie(name) {
        let match = document.cookie.match(RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
        return match ? match[1] : null;
      }
      setUdid(get("udid") ?? cookie("udid") ?? "");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <head>
        <TitleTags title="Frequently Asked Questions" />
      </head>
      <div id="signer" className="mx-5 mb-12 mt-8">
        <div class="grid grid-cols-2 gap-4 pb-8">
          <div class="flex items-center col-span-2 md:col-span-1 justify-center md:flex-row flex-col">
            <div class="w-full md:w-5/12">
              <label
                for="uploaded_file"
                class="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div class="flex flex-col items-center justify-center">
                  <svg
                    aria-hidden="true"
                    class="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                    {/* {translationList?.upload_ipa} */}
                    Upload IPA
                  </p>
                </div>
                <input id="uploaded_file" type="file" class="hidden" />
              </label>
              {showLinksNotReady && (
                <p id="link_not_ready" class="text-red-600">
                  {translationList?.upload_not_complete}
                </p>
              )}
              <div id="preuploadoutput"></div>
              {showProgress && (
                <div id="progress">
                  <div class="flex justify-between mb-1">
                    <span class="text-base font-medium text-blue-700 dark:text-white" id="status"></span>
                    <span class="text-sm font-medium text-blue-700 dark:text-white" id="eta"></span>
                  </div>
                  <div id="progressContainer" class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"></div>
                  <div class="flex justify-between my-1 text-xs">
                    <div id="upload_speed"></div>
                    <div id="remaining_size"></div>
                  </div>
                </div>
              )}
              <div id="output"></div>
              <p class="font-semibold my-1 text-center">{translationList?.or}</p>
              <input
                class="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full mb-4 dark:text-gray-700"
                placeholder="Starfiles ID"
                type="text"
                id="ipa"
                value={ipa}
                onChange={(e) => setIpa(e.target.value)}
              />
            </div>
            <div class="md:ml-4 md:mt-0 mt-4 w-full md:w-5/12 text-center">
              <div class="grid grid-cols-1">
                <input
                  class="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full mb-3 dark:text-gray-700"
                  placeholder="UDID"
                  type="udid"
                  id="udid"
                  value={udid}
                  onChange={(e) => setUdid(e.target.value)}
                  pattern="[a-fA-F0-9]{40}|[0-9]{8}-[a-fA-F0-9]{16}"
                />
                <select
                  class="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full mb-3 dark:text-gray-700"
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
                  class="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full dark:text-gray-700"
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
              <div class="mt-2">
                <button
                  type="button"
                  class="text-white bg-primary hover:bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-0.5 md:mr-0"
                  id="sign_button"
                  onClick={async () => {
                    if (udid === "") {
                      alert("UDID missing");
                      return;
                    }
                    if (ipa === "") {
                      window.location.href = document.querySelector("#output a")?.getAttribute("href");
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
                {/* <!--<button type="button" class="text-white bg-[#--><?php //echo $theme['primary'];?>
                        <!--] hover:bg-[#--><?php //echo $theme['secondary'];?>
                        <!--] font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-0.5 md:mr-0" id="appdb_sign_button" type="submit">AppDB</button> */}
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="w-full rounded-lg shadow-md bg-gray-100 dark:bg-gray-900">
              <div class="h-32 bg-blue-600 rounded-lg grid place-items-center" id="news_icon"></div>
              <div class="p-5">
                <a href="/best_apps_to_sideload">
                  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {" "}
                    Best Apps to Sideload!{" "}
                  </h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {translationList?.check_out_top_picks_2023}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="block pb-8">
            <h3 class="text-2xl font-semibold mb-4">{translationList?.optional_settings}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <input
                class="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full dark:text-gray-700"
                placeholder={translationList?.custom_bundle_id}
                type="text"
                id="custom_bundle_id"
                value={customBundleID}
                onChange={(e) => setCustomBundleID(e.target.value)}
              />
              <input
                class="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full dark:text-gray-700"
                placeholder={translationList?.custom_name}
                type="text"
                id="custom_app_name"
                value={customAppName}
                onChange={(e) => setCustomAppName(e.target.value)}
              />
              <input
                class="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full dark:text-gray-700"
                placeholder={translationList?.custom_version}
                type="text"
                id="custom_version"
                value={customVersion}
                onChange={(e) => setCustomVersion(e.target.value)}
              />
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="default_bundle_id" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.default_bundle_id}</span>
              </label>
            </div>
          </div>
          <div class="block pb-8">
            <h3 class="text-2xl font-semibold mb-4">{translationList?.drm_bypass}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="remove_mobileprovision" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.remove_mobileprovision}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="bypass_sideload_detection_1" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.bypass_sideload_detection_sideloady}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="bypass_sideload_detection_2" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.bypass_sideload_detection_1}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="bypass_sideload_detection_3" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.bypass_sideload_detection_2}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="block_ads_1" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">Block Ads (1)</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="block_ads_2" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">Block Ads (2)</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="bypass_iap" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.bypass_iap}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="bypass_apple_arcade_drm" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.bypass_aa_drm}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="cheat_engine" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.cheat_engine}</span>
              </label>
            </div>
          </div>
          <div class="block pb-8">
            <h3 class="text-2xl font-semibold mb-4">{translationList?.user_interface}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="force_enable_promotion" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.force_enable_promotion}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="force_disable_promotion" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.force_disable_promotion}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="force_dark_status_bar" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.force_dark_status_bar}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="force_light_status_bar" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.force_light_status_bar}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="force_auto_status_bar" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.force_auto_status_bar}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="disable_forced_orientation" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.disable_forced_orientation}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="disable_forced_fullscreen" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.disable_forced_fullscreen}</span>
              </label>
            </div>
          </div>
          <div class="block pb-8">
            <h3 class="text-2xl font-semibold mb-4">{translationList?.privacy}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="disable_firebase_analytics_collection" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.disable_firebase_analytics_collection}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="disable_facebook_analytics_collection" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.disable_facebook_analytics_collection}</span>
              </label>
            </div>
          </div>
          <div class="block pb-8">
            <h3 class="text-2xl font-semibold mb-4">{translationList?.compatibility}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <input
                class="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full dark:text-gray-700"
                placeholder="Minimum iOS"
                type="text"
                id="minimum_ios"
              />
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="remove_uisupporteddevices_check" checked />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.remove_uisupporteddevices_checks}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="appletv" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.apple_tv_mode}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="disable_ios_requirement" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.disable_ios_requirement}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="remove_plugins" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.remove_plugins}</span>
              </label>
            </div>
          </div>
          <div class="block pb-8">
            <h3 class="text-2xl font-semibold mb-4">{translationList?.power_saving}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="disable_forced_wifi" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.disable_forced_wifi}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="disable_background_execution" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.disable_background_execution}</span>
              </label>
            </div>
          </div>
          <div class="block pb-8">
            <h3 class="text-2xl font-semibold mb-4">{translationList?.other}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="enable_file_sharing" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.enable_file_sharing}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="remove_password_denylist" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.remove_password_denylist}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="remove_localisations" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.remove_localizations}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input type="checkbox" class="sr-only peer" id="disable_url_schemes" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.remove_url_schemes}</span>
              </label>
              <label class="relative inline-flex items-center gap-3 cursor-pointer h-[25px]">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  id="make_private"
                  onchange="starfiles.public=!this.checked"
                />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ff40]"></div>
                <span class="text-sm font-medium">{translationList?.make_ipa_private}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signer;
