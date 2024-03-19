"use client";
import { getTranslations } from "@/utils/getTranslation";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TitleTags from "../components/Title";

function App() {
  const [translationList, setTranslationList] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [showIcon, setShowIcon] = useState(true);
  const [showDownloadButton, setShowDownloadButton] = useState(true);
  const [showReleaseNotes, setShowReleaseNotes] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showAdvisories, setShowAdvisories] = useState(true);
  const [showScreenshots, setShowScreenshots] = useState(true);
  const [showMinimumIos, setShowMinimumIos] = useState(true);
  const [showReleaseDate, setShowReleaseDate] = useState(true);
  const [showVersionReleaseDate, setShowVersionReleaseDate] = useState(true);
  const [showGenres, setShowGenres] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showSize, setShowSize] = useState(true);
  const [showAgeRating, setShowAgeRating] = useState(true);
  const [showVersion, setShowVersion] = useState(true);
  const [showRating, setShowRating] = useState(true);

  const [title, setTitle] = useState("Signtunes");
  const [name, setName] = useState("");
  const [description, setDescription] = useState(null);
  const [uploadTime, setUploadTime] = useState(null);
  const [views, setViews] = useState(null);
  const [downloads, setDownloads] = useState(null);
  const [starfilesVersion, setStarfilesVersion] = useState(null);
  const [size, setSize] = useState(null);
  const [bundleID, setBundleID] = useState(null);
  const [sha256, setSha256] = useState(null);
  const [starfilesMinimumIOS, setStarfilesMinimumIOS] = useState(null);
  const [starfilesMaximumIOS, setStarfilesMaximumIOS] = useState(null);
  const [icon, setIcon] = useState(null);
  const [developer, setDeveloper] = useState(null);
  const [releaseNotes, setReleaseNotes] = useState(null);
  const [price, setPrice] = useState(null);
  const [ageRating, setAgeRating] = useState(null);
  const [version, setVersion] = useState(null);
  const [rating, setRating] = useState(null);
  const [minimumIos, setMinimumIos] = useState(null);
  const [releaseDate, setReleaseDate] = useState(null);
  const [versionReleaseDate, setVersionReleaseDate] = useState(null);
  const [genres, setGenres] = useState(null);
  const [features, setFeatures] = useState(null);
  const [advisories, setAdvisories] = useState(null);
  const [screenshots, setScreenshots] = useState(null);

  useEffect(() => {
    // Get Translations
    getTranslationList();
    // Check Title
    checkTitle();
    // Get Data
    getData();
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

  // Check Title
  const checkTitle = async () => {
    try {
      const res = await axios.get("https://api2.starfiles.co/file/" + id);
      setTitle(res.data?.clean_name ?? "Signtunes");
    } catch (err) {
      console.error(err.message);
    }
  };

  // Get Time Difference
  function timeDifference(ts) {
    const difference = Math.floor(new Date().getTime() / 1000) - ts;
    let output = ``;
    if (difference < 60) return `${difference} seconds ago`;
    else if (difference < 3600) return `${Math.floor(difference / 60)} minutes ago`;
    else if (difference < 86400) return `${Math.floor(difference / 3600)} hours ago`;
    else if (difference < 2620800) return `${Math.floor(difference / 86400)} days ago`;
    else if (difference < 31449600) return `${Math.floor(difference / 2620800)} months ago`;
    else return `${Math.floor(difference / 31449600)} years ago`;
  }

  const getData = async () => {
    try {
      let appdb_data = {};
      let appdb_checked = true;
      const res = await axios.get("https://api2.starfiles.co/file/" + id);
      const data = res.data;
      if (typeof data.name == "undefined") {
        setName("File not found");
        setShowIcon(false);
        setDescription(<></>);
        setShowDownloadButton(false);
        setShowReleaseNotes(false);
      } else {
        setUploadTime(data.time_ago);
        setViews(data.view_count);
        setDownloads(data.download_count);
        setStarfilesVersion(data.version);
        setSize(data.tidy_size);
        setBundleID(data.bundle_id);
        setSha256(data.hash.sha256);
        setStarfilesMinimumIOS(data.min_compatible_version);
        setStarfilesMaximumIOS(data.max_compatible_version);

        function checkAppDB() {
          if (Object.keys(appdb_data).length == 0 && typeof appdb_checked == "undefined") {
            setTimeout(checkAppDB, 100);
          } else {
            document.getElementById("icon").addEventListener("error", function () {
              setIcon(appdb_data.image);
            });

            let appstoreRes = axios.get("https://api2.starfiles.co/appstore_lookup?bundleId=" + data.bundle_id);
            let appstore_data = appstoreRes.data;

            if (appstore_data?.resultCount >= 1) {
              appstore_data = appstore_data.results[0];
              setName(appstore_data.trackName);
              document.title = appstore_data.trackName;
              setDeveloper(appstore_data.artistName);
              setDescription(
                <>
                  {appstore_data.description.split("\n").map((desc, index) => (
                    <>
                      {desc}
                      <br key={index} />
                    </>
                  ))}
                </>
              );
              setReleaseNotes(
                <>
                  {appstore_data.releaseNotes.split("\n").map((note, index) => (
                    <>
                      {note}
                      <br key={index} />
                    </>
                  ))}
                </>
              );
              setIcon(appstore_data.artworkUrl512 ?? appstore_data.artworkUrl100);
              if (typeof appstore_data.formattedPrice === "undefined") setShowPrice(false);
              setPrice(appstore_data.formattedPrice);
              setAgeRating(appstore_data.contentAdvisoryRating);
              setVersion(appstore_data.version);
              setRating(Math.round(appstore_data.averageUserRating));
              if (typeof appstore_data.fileSizeBytes == "undefined") setShowSize(false);
              setSize(appstore_data.fileSizeBytes);
              setMinimumIos(appstore_data.minimumOsVersion);
              setReleaseDate(appstore_data.releaseDate);
              setVersionReleaseDate(appstore_data.currentVersionReleaseDate);
              setGenres(
                <>
                  {appstore_data.genres.map((genre, index) => (
                    <>
                      {genre}
                      <br key={index} />
                    </>
                  ))}
                </>
              );
              if (appstore_data.features.length == 0) setShowFeatures(false);
              setFeatures(
                <>
                  {appstore_data.features.map((feature, index) => (
                    <>
                      {feature}
                      <br key={index} />
                    </>
                  ))}
                </>
              );
              if (appstore_data.advisories.length == 0) setShowAdvisories(false);
              setAdvisories(
                <>
                  {appstore_data.advisories.map((advisory, index) => (
                    <>
                      {advisory}
                      <br key={index} />
                    </>
                  ))}
                </>
              );
              if (
                appstore_data.screenshotUrls.length +
                  appstore_data.ipadScreenshotUrls.length +
                  appstore_data.appletvScreenshotUrls ==
                0
              )
                showScreenshots(false);
              setScreenshots(
                <>
                  {appstore_data?.screenshotUrls.map((ss, index) => (
                    <img key={index} src={ss} className="rounded-lg" />
                  ))}
                  {appstore_data?.ipadScreenshotUrls.map((ss, index) => (
                    <img key={index} src={ss} className="rounded-lg" />
                  ))}
                  {appstore_data?.appletvScreenshotUrls.map((ss, index) => (
                    <img key={index} src={ss} className="rounded-lg" />
                  ))}
                </>
              );
            } else {
              setName(data.clean_name ?? data.name.replace(".ipa", ""));
              setTitle(data.clean_name ?? data.name.replace(".ipa", ""));
              setIcon("https://sts.st/bi/" + data.bundle_id);
              if (data.description) setDescription(data.description.substring(0, 200) + "...");
              else if (appdb_data.description) setDescription(appdb_data.description.substring(0, 200) + "...");
              else setDescription("");
              if (typeof appdb_data.whatsnew != "undefined") setReleaseNotes(appdb_data.whatsnew);
              else setShowReleaseNotes(false);
              setShowScreenshots(false);
              setShowMinimumIos(false);
              setShowReleaseDate(false);
              setShowVersionReleaseDate(false);
              setShowGenres(false);
              setShowPrice(false);
              setShowAgeRating(false);
              setShowVersion(false);
              setShowRating(false);
              setShowFeatures(false);
              setShowAdvisories(false);
            }
          }
        }
        checkAppDB();

        function isJson(str) {
          try {
            JSON.parse(str);
          } catch (e) {
            return false;
          }
          return true;
        }

        fetch("//api.dbservices.to/v1.6/search?type=cydia&bundle_ids=" + data.bundle_id)
          .then((response) => response.text())
          .then((response) => {
            if (!isJson(response) || typeof JSON.parse(response).data[0] == "undefined") {
              fetch("//api.dbservices.to/v1.6/search?type=ios&bundle_ids=" + data.bundle_id)
                .then((response) => response.text())
                .then((response) => {
                  if (!isJson(response) || typeof JSON.parse(response).data[0] == "undefined") {
                    fetch("//api.dbservices.to/v1.6/search?type=osx&bundle_ids=" + data.bundle_id)
                      .then((response) => response.text())
                      .then((response) => {
                        if (!isJson(response) || typeof JSON.parse(response).data[0] == "undefined") {
                          fetch("//api.dbservices.to/v1.6/search?type=standalone&bundle_ids=" + data.bundle_id)
                            .then((response) => response.text())
                            .then((response) => {
                              if (!isJson(response) || typeof JSON.parse(response).data[0] == "undefined") {
                                fetch("//api.dbservices.to/v1.6/search?type=tvos&bundle_ids=" + data.bundle_id)
                                  .then((response) => response.text())
                                  .then((response) => {
                                    if (isJson(response) && typeof JSON.parse(response).data[0] != "undefined")
                                      appdb_data = JSON.parse(response).data[0];
                                    else appdb_checked = true;
                                  });
                              } else appdb_data = JSON.parse(response).data[0];
                            });
                        } else appdb_data = JSON.parse(response).data[0];
                      });
                  } else appdb_data = JSON.parse(response).data[0];
                });
            } else appdb_data = JSON.parse(response).data[0];
          });
        fetch("//api.starfiles.co/bundle_id/" + data.bundle_id)
          .then((response) => response.json())
          .then((bundle_id_data) => {
            document.getElementById("download_links").innerHTML = "";
            for (var version in bundle_id_data.apps) {
              if (bundle_id_data.apps.hasOwnProperty(version)) {
                str = "";
                for (i = 0; i < bundle_id_data.apps[version].length; i++) {
                  str +=
                    `<div class="flex items-center justify-between">
                                <div>
                                    <p class="text-l">` +
                    bundle_id_data.apps[version][i].clean_ipa_filename +
                    `</p>
                                    <p class="text-xs">Uploaded ` +
                    timeDifference(bundle_id_data.apps[version][i].upload_time) +
                    ` • ` +
                    bundle_id_data.apps[version][i].views +
                    ` Views • ` +
                    bundle_id_data.apps[version][i].downloads +
                    ` Downloads</p>
                                </div>
                                <div class="flex flex-col md:flex-row text-right gap-1">` +
                    (document.cookie.indexOf("udid=") === -1
                      ? `<a href="/purchase" type="button" class="text-white bg-[#<?php echo $theme['secondary'];?>] hover:bg-[#0096C7] md:font-medium text-xs rounded-lg py-2.5 text-center w-[5rem]">Install</a>`
                      : `<a href="/signer#` +
                        bundle_id_data.apps[version][i].id +
                        `" type="button" class="text-white bg-[#<?php echo $theme['secondary'];?>] hover:bg-[#0096C7] md:font-medium text-xs rounded-lg py-2.5 text-center w-[5rem]">Install</a>`) +
                    `<a href="//starfiles.co/file/` +
                    bundle_id_data.apps[version][i].id +
                    `" type="button" class="text-white bg-[#0096C7] hover:bg-[#<?php echo $theme['primary'];?>] md:font-medium text-xs rounded-lg py-2.5 text-center w-[5rem]">Download</a>
                                </div>
                            </div>`;
                  if (i == bundle_id_data.apps.len && id != bundle_id_data.apps[version][i].id)
                    window.location.href = "/app/" + bundle_id_data.apps[version][i].id;
                }
                document.getElementById("download_links").innerHTML +=
                  '<h3 class="text-xl font-semibold mt-4">' +
                  version +
                  '</h3><div class="grid grid-cols-1 gap-1">' +
                  str +
                  "</div>";
              }
            }
            document.getElementById("views").innerHTML =
              bundle_id_data.views > 1000 ? Math.round(bundle_id_data.views / 1000) + "K" : bundle_id_data.views;
            document.getElementById("downloads").innerHTML =
              bundle_id_data.downloads > 1000
                ? Math.round(bundle_id_data.downloads / 1000) + "K"
                : bundle_id_data.downloads;
          });
      }
    } catch (err) {
      alert(err.message);
      console.error(err.message);
    }
  };

  return (
    <>
      <head>
        <TitleTags title={title} />
        <meta name="twitter:image" content={`https://cdn.starfiles.co/file/icon/${id}`} />
        <meta name="twitter:image:src" content={`https://cdn.starfiles.co/file/icon/${id}`} />
        <meta name="twitter:image:alt" content={`${id}`} />
        <meta property={`image" content="https://cdn.starfiles.co/file/icon/${id}`} />
        <meta content={`https://cdn.starfiles.co/file/icon/${id}`} property="snapchat:sticker" />
        <meta property="og:image" content={`https://cdn.starfiles.co/file/icon/${id}`} />
        <meta property="og:image:url" content={`https://cdn.starfiles.co/file/icon/${id}`} />
        <meta property="og:image:secure_url" content={`https://cdn.starfiles.co/file/icon/${id}`} />
      </head>
      <div className="md:mx-12 md:my-12 mx-5 my-6">
        <div class="flex items-center mb-8 max-w-2xl">
          {showIcon && <img class="md:h-40 md:w-40 w-24 h-24 rounded-[24%]" id="icon" src={icon} />}
          <div class="ml-4">
            <p class="text-2xl font-bold dark:text-white" id="name">
              {name}
            </p>
            <p class="text-sm" id="developer">
              {developer}
            </p>
            <p class="text-xs" id="description">
              {description ? (
                description
              ) : (
                <span class="w-4 h-4 mx-auto my-8">
                  <span role="status">
                    <svg
                      aria-hidden="true"
                      class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#0096C7]"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </span>
                </span>
              )}
            </p>
            {showDownloadButton && (
              <button
                loader-ignore-click="true"
                data-modal-target="defaultModal"
                data-modal-toggle="defaultModal"
                class="block text-white bg-[#0096C7] hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2"
                type="button"
                id="download_button"
              >
                Download
              </button>
            )}

            {/* Main Model */}
            <div
              id="defaultModal"
              tabindex="-1"
              aria-hidden="true"
              class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
            >
              <div class="relative w-full h-full max-w-2xl md:h-auto">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Download</h3>
                    <button
                      type="button"
                      class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="defaultModal"
                    >
                      <svg
                        aria-hidden="true"
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span class="sr-only">Close modal</span>
                    </button>
                  </div>
                  <div class="px-6 pb-6 md:h-[75vh] h-[100vh] overflow-scroll" id="download_links">
                    <div class="w-4 h-4 mx-auto my-8">
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#0096C7]"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {showScreenshots && (
            <div class="block pb-8">
              <h3 class="text-2xl font-semibold mb-4">Screenshots</h3>
              <div id="screenshots" class="flex h-64 gap-2 overflow-x-scroll">
                {screenshots}
              </div>
            </div>
          )}
          {showReleaseNotes && (
            <div class="block pb-8">
              <h3 class="text-2xl font-semibold mb-4 dark:text-white">What's New?</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300" id="release_notes">
                {releaseNotes ? (
                  releaseNotes
                ) : (
                  <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                    Loading...
                  </span>
                )}
              </p>
            </div>
          )}
          <div class="block pb-8">
            <h3 class="text-2xl font-semibold mb-4">App Info</h3>
            <div class="block rounded-xl p-8 bg-gray-300 dark:bg-gray-800 dark:text-gray-200">
              <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {showPrice && (
                  <div>
                    <p class="font-semibold text-lg">Price</p>
                    <p id="price">
                      {price ? (
                        price
                      ) : (
                        <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <p class="font-semibold text-lg">Age Rating</p>
                  <p id="age_rating">
                    {ageRating ? (
                      ageRating
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Latest Version</p>
                  <p id="version">
                    {version ? (
                      version
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Rating</p>
                  <p id="rating">
                    {rating ? (
                      rating
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                {showSize && (
                  <div>
                    <p class="font-semibold text-lg">Size</p>
                    <p id="size">
                      {size ? (
                        size
                      ) : (
                        <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <p class="font-semibold text-lg">Minimum iOS</p>
                  <p id="minimum_ios">
                    {minimumIos ? (
                      minimumIos
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Release Date</p>
                  <p id="release_date">
                    {releaseDate ? (
                      releaseDate
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Version Release Date</p>
                  <p id="version_release_date">
                    {versionReleaseDate ? (
                      versionReleaseDate
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Genres</p>
                  <p id="genres">
                    {genres ? (
                      genres
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                {showFeatures && (
                  <div>
                    <p class="font-semibold text-lg">Features</p>
                    <p id="features">
                      {features ? (
                        features
                      ) : (
                        <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {showAdvisories && (
                  <div>
                    <p class="font-semibold text-lg">Advisories</p>
                    <p id="advisories">
                      {advisories ? (
                        advisories
                      ) : (
                        <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <p class="font-semibold text-lg">Upload Time</p>
                  <p id="upload_time">
                    {uploadTime ? (
                      uploadTime
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Views</p>
                  <p id="views">
                    {views ? (
                      views
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Downloads</p>
                  <p id="downloads">
                    {downloads ? (
                      downloads
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Starfiles Version</p>
                  <p id="starfiles_version">
                    {starfilesVersion ? (
                      starfilesVersion
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Bundle ID</p>
                  <p id="bundle_id" style={{ wordBreak: "break-word" }}>
                    {bundleID ? (
                      bundleID
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">SHA256 Hash</p>
                  <p id="sha256" style={{ wordBreak: "break-word" }}>
                    {sha256 ? (
                      sha256
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Starfiles Minimum iOS</p>
                  <p id="starfiles_minimum_ios">
                    {starfilesMinimumIOS ? (
                      starfilesMinimumIOS
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="font-semibold text-lg">Starfiles Maximum iOS</p>
                  <p id="starfiles_maximum_ios">
                    {starfilesMaximumIOS ? (
                      starfilesMaximumIOS
                    ) : (
                      <span class="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                        Loading...
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
