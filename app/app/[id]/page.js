"use client";
import Header from "@/app/components/Layout/Header";
import cookie from "@/utils/cookies";
import { getTranslations } from "@/utils/getTranslation";
import axios from "axios";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TitleTags from "../../components/Title";
import Head from "next/head";

function App({ params, searchParams }) {
  const { id } = params;
  const [translationList, setTranslationList] = useState(null);
  const [showIcon, setShowIcon] = useState(true);
  const [showDescBox, setShowDescBox] = useState(true);
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
  const [downloadLinks, setDownloadLinks] = useState(null);
  let calledOnce = useRef(false);

  useEffect(() => {
    if (!calledOnce.current) {
      calledOnce.current = true;
      // Get Translations
      getTranslationList();
      // Get Data
      getData();
    }
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
      const data = res.data.result;
      if (typeof data.name == "undefined") {
        setName("File not found");
        setShowIcon(false);
        setDescription(<></>);
        setShowDownloadButton(false);
        setShowDescBox(false);
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

        async function checkAppDB() {
          if (Object.keys(appdb_data).length == 0 && typeof appdb_checked == "undefined") {
            setTimeout(checkAppDB, 100);
          } else {
            document.getElementById("icon").addEventListener("error", function () {
              setIcon(appdb_data.image);
            });

            let appstoreRes = await axios.get("https://api2.starfiles.co/appstore_lookup?bundleId=" + data.bundle_id);
            let appstore_data = appstoreRes.data.result;
            if (appstore_data?.resultCount >= 1) {
              appstore_data = appstore_data.results[0];
              setName(appstore_data.trackName);
              document.title = appstore_data.trackName;
              setDeveloper(appstore_data.artistName);
              setDescription(
                <>
                  {appstore_data.description
                    .substring(0, 200)
                    .split("\n")
                    .map((desc, index) => (
                      <>
                        {desc}
                        {appstore_data.description.substring(0, 200).split("\n").length > index + 1 && (
                          <br key={index} />
                        )}
                      </>
                    ))}
                  {appstore_data.description?.length > 200 ? " ..." : ""}
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
              else setDescription(<></>);
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
        let formData = new FormData();
        formData.append("type", "cydia");
        formData.append("bundle_ids", data.bundle_id);

        let cydiaRes = await axios.post("https://api.dbservices.to/v1.6/search/", formData);
        if (!isJson(cydiaRes.data) || typeof JSON.parse(cydiaRes.data).data[0] == "undefined") {
          formData.set("type", "ios");
          let iosRes = await axios.post("https://api.dbservices.to/v1.6/search/", formData);
          if (!isJson(iosRes.data) || typeof JSON.parse(iosRes.data).data[0] == "undefined") {
            formData.set("type", "osx");
            let osRes = await axios.post("https://api.dbservices.to/v1.6/search/", formData);
            if (!isJson(osRes.data) || typeof JSON.parse(osRes.data).data[0] == "undefined") {
              formData.set("type", "standalone");
              let standalone = axios.post("https://api.dbservices.to/v1.6/search/", formData);
              if (!isJson(standalone.data) || typeof JSON.parse(standalone.data).data[0] == "undefined") {
                formData.set("type", "tvos");
                let bundle = await axios.post("https://api.dbservices.to/v1.6/search/", formData);
                if (isJson(bundle.data) && typeof JSON.parse(bundle.data).data[0] != "undefined")
                  appdb_data = JSON.parse(bundle.data).data[0];
                else appdb_checked = true;
              } else {
                appdb_data = JSON.parse(standalone.data).data[0];
              }
            } else {
              appdb_data = JSON.parse(osRes.data).data[0];
            }
          } else {
            appdb_data = JSON.parse(iosRes.data).data[0];
          }
        } else {
          appdb_data = JSON.parse(cydiaRes.data).data[0];
        }

        await axios.get("https://api2.starfiles.co/bundle_id/" + data.bundle_id).then((bundleData) => {
          let bundle_id_data = bundleData.data.result;
          let highestVersion = null;
          setDownloadLinks(
            <>
              {Object.keys(bundle_id_data?.apps)?.map((version, versionIndex) => {
                if (!highestVersion) highestVersion = version;
                if (bundle_id_data.apps.hasOwnProperty(version))
                  return (
                    <>
                      <h3 key={versionIndex} className="text-xl font-semibold mt-4">
                        {version}
                      </h3>
                      <div className="grid grid-cols-1 gap-1">
                        {bundle_id_data.apps[version].map((app, index) => {
                          if (index == bundle_id_data.apps.len && id != app.id)
                            window.location.href = "/app?id=" + app.id;
                          return (
                            <div className="flex items-center justify-between" key={index}>
                              <div>
                                <p className="text-l">{app.clean_ipa_filename}</p>
                                <p className="text-xs">
                                  Uploaded {timeDifference(app.upload_time)} • {app.views} Views • {app.downloads}{" "}
                                  Downloads
                                </p>
                              </div>
                              <div className="flex flex-col md:flex-row text-right gap-1">
                                {!cookie("udid") ? (
                                  <Link
                                    href="/purchase"
                                    type="button"
                                    className="text-white bg-secondary hover:bg-[#0096C7] md:font-medium text-xs rounded-lg py-2.5 text-center w-[5rem]"
                                  >
                                    Install
                                  </Link>
                                ) : (
                                  <Link
                                    href={"/signer#" + app.id}
                                    type="button"
                                    className="text-white bg-secondary hover:bg-[#0096C7] md:font-medium text-xs rounded-lg py-2.5 text-center w-[5rem]"
                                  >
                                    Install
                                  </Link>
                                )}
                                <a
                                  href={"https://starfiles.co/file/" + app.id}
                                  type="button"
                                  className="text-white bg-[#0096C7] hover:bg-primary md:font-medium text-xs rounded-lg py-2.5 text-center w-[5rem]"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                else return <></>;
              })}
            </>
          );
          setStarfilesVersion(highestVersion);
          setViews(bundle_id_data.views > 1000 ? Math.round(bundle_id_data.views / 1000) + "K" : bundle_id_data.views);
          setDownloads(
            bundle_id_data.downloads > 1000
              ? Math.round(bundle_id_data.downloads / 1000) + "K"
              : bundle_id_data.downloads
          );
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <Head>
        <TitleTags title={title} />
        <meta name="twitter:image" content={`https://cdn.starfiles.co/file/icon/${id}`} />
        <meta name="twitter:image:src" content={`https://cdn.starfiles.co/file/icon/${id}`} />
        <meta name="twitter:image:alt" content={`${id}`} />
        <meta property={`image" content="https://cdn.starfiles.co/file/icon/${id}`} />
        <meta content={`https://cdn.starfiles.co/file/icon/${id}`} property="snapchat:sticker" />
        <meta property="og:image" content={`https://cdn.starfiles.co/file/icon/${id}`} />
        <meta property="og:image:url" content={`https://cdn.starfiles.co/file/icon/${id}`} />
        <meta property="og:image:secure_url" content={`https://cdn.starfiles.co/file/icon/${id}`} />
      </Head>
      <Header searchParams={searchParams} />
      <div className="md:mx-12 md:my-12 mx-5 my-6">
        <div className="flex items-center mb-8 max-w-2xl">
          {showIcon && <img className="md:h-40 md:w-40 w-24 h-24 rounded-[24%]" id="icon" src={icon} />}
          <div className="ml-4">
            <p className="text-2xl font-bold dark:text-white" id="name">
              {name}
            </p>
            <p className="text-sm" id="developer">
              {developer}
            </p>
            <p className="text-xs" id="description">
              {description ? (
                description
              ) : (
                <span className="w-4 h-4 mx-auto my-8">
                  <span role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#0096C7]"
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
                    <span className="sr-only">Loading...</span>
                  </span>
                </span>
              )}
            </p>
            {showDownloadButton && (
              <button
                loader-ignore-click="true"
                data-modal-target="defaultModal"
                data-modal-toggle="defaultModal"
                className="block text-white bg-[#0096C7] hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2"
                type="button"
                id="download_button"
                onClick={() => document.getElementById("defaultModal")?.showModal()}
              >
                Download
              </button>
            )}

            {/* Main Model */}
            <dialog id="defaultModal" tabindex="-1" aria-hidden="true" className="modal">
              <div className="modal-box !overflow-hidden !p-0">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Download</h3>
                    <form method="dialog">
                      <button
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="defaultModal"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5"
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
                        <span className="sr-only">Close modal</span>
                      </button>
                    </form>
                  </div>
                  <div className="px-6 pb-6 md:h-[75vh] h-[100vh] overflow-scroll" id="download_links">
                    {downloadLinks ? (
                      downloadLinks
                    ) : (
                      <div className="w-4 h-4 mx-auto my-8">
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#0096C7]"
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
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </dialog>
          </div>
        </div>
        {showDescBox && (
          <div>
            {showScreenshots && (
              <div className="block pb-8">
                <h3 className="text-2xl font-semibold mb-4">Screenshots</h3>
                <div id="screenshots" className="flex h-64 gap-2 overflow-x-scroll">
                  {screenshots}
                </div>
              </div>
            )}
            {showReleaseNotes && (
              <div className="block pb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">What's New?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300" id="release_notes">
                  {releaseNotes ? (
                    releaseNotes
                  ) : (
                    <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                      Loading...
                    </span>
                  )}
                </p>
              </div>
            )}
            <div className="block pb-8">
              <h3 className="text-2xl font-semibold mb-4">App Info</h3>
              <div className="block rounded-xl p-8 bg-gray-300 dark:bg-gray-800 dark:text-gray-200">
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {showPrice && (
                    <div>
                      <p className="font-semibold text-lg">Price</p>
                      <p id="price">
                        {price ? (
                          price
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {showAgeRating && (
                    <div>
                      <p className="font-semibold text-lg">Age Rating</p>
                      <p id="age_rating">
                        {ageRating ? (
                          ageRating
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {showVersion && (
                    <div>
                      <p className="font-semibold text-lg">Latest Version</p>
                      <p id="version">
                        {version ? (
                          version
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {showRating && (
                    <div>
                      <p className="font-semibold text-lg">Rating</p>
                      <p id="rating">
                        {rating ? (
                          rating
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {showSize && (
                    <div>
                      <p className="font-semibold text-lg">Size</p>
                      <p id="size">
                        {size ? (
                          size
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {showMinimumIos && (
                    <div>
                      <p className="font-semibold text-lg">Minimum iOS</p>
                      <p id="minimum_ios">
                        {minimumIos ? (
                          minimumIos
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {showReleaseDate && (
                    <div>
                      <p className="font-semibold text-lg">Release Date</p>
                      <p id="release_date">
                        {releaseDate ? (
                          releaseDate
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {showVersionReleaseDate && (
                    <div>
                      <p className="font-semibold text-lg">Version Release Date</p>
                      <p id="version_release_date">
                        {versionReleaseDate ? (
                          versionReleaseDate
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {showGenres && (
                    <div>
                      <p className="font-semibold text-lg">Genres</p>
                      <p id="genres">
                        {genres ? (
                          genres
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {showFeatures && (
                    <div>
                      <p className="font-semibold text-lg">Features</p>
                      <p id="features">
                        {features ? (
                          features
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {showAdvisories && (
                    <div>
                      <p className="font-semibold text-lg">Advisories</p>
                      <p id="advisories">
                        {advisories ? (
                          advisories
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg">Upload Time</p>
                    <p id="upload_time">
                      {uploadTime ? (
                        uploadTime
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Views</p>
                    <p id="views">
                      {views ? (
                        views
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Downloads</p>
                    <p id="downloads">
                      {downloads ? (
                        downloads
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Starfiles Version</p>
                    <p id="starfiles_version">
                      {starfilesVersion ? (
                        starfilesVersion
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Bundle ID</p>
                    <p id="bundle_id" style={{ wordBreak: "break-word" }}>
                      {bundleID ? (
                        bundleID
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">SHA256 Hash</p>
                    <p id="sha256" style={{ wordBreak: "break-word" }}>
                      {sha256 ? (
                        sha256
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Starfiles Minimum iOS</p>
                    <p id="starfiles_minimum_ios">
                      {starfilesMinimumIOS ? (
                        starfilesMinimumIOS
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Starfiles Maximum iOS</p>
                    <p id="starfiles_maximum_ios">
                      {starfilesMaximumIOS ? (
                        starfilesMaximumIOS
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-[#023E8A] bg-bright rounded-full animate-pulse">
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
