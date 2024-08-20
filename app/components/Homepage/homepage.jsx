"use client";
import cookie from "@/utils/cookies";
import { formatNumber, formatSize } from "@/utils/format";
import { getTranslations } from "@/utils/getTranslation";
import getUserLanguageCode from "@/utils/userLanguageCode";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "../Layout/Header";
import Image from "next/image";

export default function Homepage({ searchParams }) {
  const { referral } = searchParams;
  // console.log("referral2", referral);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState({ success: false, message: "" });
  const [mainContentLoad, setMainContentLoad] = useState(false);
  const [alertsLoad, setAlertsLoad] = useState(false);
  const [alertOptions, setAlertOptions] = useState({ isPro: null, deviceExists: null });
  const [email, setEmail] = useState("");
  const [statsLoad, setStatsLoad] = useState(false);
  const [genreData, setGenreData] = useState({
    popular: [],
    trending: [],
    upload_time: [],
    apple_tv_apps: [],
  });
  const [categories, setCategories] = useState([]);
  const [translationList, setTranslationList] = useState(null);
  const [count, setCount] = useState({ uploadCount: "", downloadCount: "", sizeUpload: "" });
  const [currentClicked, setCurrentClicked] = useState("All");
  const [isRegistered, setIsRegistered] = useState(false);
  const defaultIconUrl = "https://cdn.starfiles.co/images/dark-icon.png"
  let isCalled = false;
const uuid = cookie("udid")
  useEffect(() => {
    if (!isCalled) {
      isCalled = true;
      if(uuid){
        checkDeviceRegistration()
      }
      // Revealing main content once the site is loaded
      setMainContentLoad(true);
      // Get genre
      getGenre(false);
      // Get Categories
      getCategories();
      // Get Translations
      getTranslationList();
      // Stats
      getStats();
      // Alerts
      getAlerts();
    }
  }, [uuid]);

  async function checkDeviceRegistration() {
    try {
      const response = await axios.get(`https://api2.starfiles.co/device/${udid}`);
      const data = response.data;

      if (data.result && data.result.registered !== undefined) {
        setIsRegistered(data.result.registered);
      } else {
        throw new Error("Device registration status is undefined");
      }
    } catch (error) {
      console.error("Error checking device registration:", error);
      setIsRegistered(false); // or null to indicate the status couldn't be determined
    }
  }
  // Get Genre
  const getGenre = async (genre) => {
    const genreTypes = ["popular", "trending", "upload_time"];
    for (let gt of genreTypes) {
      try {
        let response = await axios.get(
          `https://api2.starfiles.co/files?public=true&extension=ipa&sort=${gt}&group=bundle_id&collapse=true&limit=50${
            genre !== false ? "&genre=" + encodeURIComponent(genre) : ""
          }`
        );
        setGenreData((prev) => {
          prev[gt] = response.data.result;
          return { ...prev };
        });
        if (gt === "trending") {
          let response = await axios.get(
            `https://api2.starfiles.co/files?public=true&extension=ipa&sort=${gt}&group=bundle_id&collapse=true&limit=500&tvos=true${
              genre !== false ? "&genre=" + encodeURIComponent(genre) : ""
            }`
          );
          setGenreData((prev) => {
            prev["apple_tv_apps"] = response.data.result;
            return { ...prev };
          });
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  // Get Categories
  const getCategories = async () => {
    try {
      let response = await axios.get("https://api2.starfiles.co/categories");
      setCategories(response.data.result || []);
    } catch (err) {
      console.error(err.message);
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

  // Get Stats
  const getStats = async () => {
    if (!cookie("udid")) {
      try {
        const response = await axios.get("https://api2.starfiles.co/statistics?extension=ipa");
        setCount((prev) => {
          prev["uploadCount"] = formatNumber(response.data.result.upload_count);
          prev["downloadCount"] = formatNumber(response.data.result.download_count);
          prev["sizeUpload"] = formatSize(response.data.result.bits_uploaded / 8);
          return { ...prev };
        });
        setStatsLoad(true);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  // Get Alerts
  const getAlerts = async () => {
    try {
      const device = await axios.get("https://api2.starfiles.co/device/" + cookie("udid"));
      setAlertOptions({
        device: device?.data?.pro || false,
        deviceExists: device?.data?.registered,
      });
      setEmail(device.data?.email ?? "");

      setAlertsLoad(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <Header searchParams={searchParams} />
      <main className="mx-5 md:mx-12 mt-5 grid grid-cols-4 mb-6 ">
        <div className="md:w-12/12 col-span-4 md:col-span-3 grid grid-cols-6">
          {alertsLoad && (
            <div className="col-span-6" id="alerts">
              {/* <div className="alert bg-teal-100 text-black shadow-lg p-3 pb-2 md:p-2 gap-0 mb-4 font-medium">
                <div className="alert-child">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="flex-shrink-0 w-6 h-6">
                    <linearGradient
                      id="StripeClimate-gradient-a"
                      gradientUnits="userSpaceOnUse"
                      x1="16"
                      y1="20.6293"
                      x2="16"
                      y2="7.8394"
                      gradientTransform="matrix(1 0 0 -1 0 34)"
                    >
                      <stop offset="0" stopColor={"#00d924"} />
                      <stop offset="1" stopColor={"#00cb1b"} />
                    </linearGradient>
                    <path d="M0 10.82h32c0 8.84-7.16 16-16 16s-16-7.16-16-16z" fill="url(#StripeClimate-gradient-a)" />
                    <linearGradient
                      id="StripeClimate-gradient-b"
                      gradientUnits="userSpaceOnUse"
                      x1="24"
                      y1="28.6289"
                      x2="24"
                      y2="17.2443"
                      gradientTransform="matrix(1 0 0 -1 0 34)"
                    >
                      <stop offset=".1562" stopColor={"#009c00"} />
                      <stop offset="1" stopColor={"#00be20"} />
                    </linearGradient>
                    <path
                      d="M32 10.82c0 2.21-1.49 4.65-5.41 4.65-3.42 0-7.27-2.37-10.59-4.65 3.52-2.43 7.39-5.63 10.59-5.63C29.86 5.18 32 8.17 32 10.82z"
                      fill="url(#StripeClimate-gradient-b)"
                    />
                    <linearGradient
                      id="StripeClimate-gradient-c"
                      gradientUnits="userSpaceOnUse"
                      x1="8"
                      y1="16.7494"
                      x2="8"
                      y2="29.1239"
                      gradientTransform="matrix(1 0 0 -1 0 34)"
                    >
                      <stop offset="0" stopColor={"#ffe37d"} />
                      <stop offset="1" stopColor={"#ffc900"} />
                    </linearGradient>
                    <path
                      d="M0 10.82c0 2.21 1.49 4.65 5.41 4.65 3.42 0 7.27-2.37 10.59-4.65-3.52-2.43-7.39-5.64-10.59-5.64C2.14 5.18 0 8.17 0 10.82z"
                      fill="url(#StripeClimate-gradient-c)"
                    />
                  </svg>
                  <span>{translationList?.co2_notice}</span>
                </div>
                <div className="alert-child">
                  <a className="alert-btn" href="https://climate.stripe.com/j4bbsV">
                    {translationList?.details}
                  </a>
                  <a className="alert-btn" href="/purchase">
                    {translationList?.purchase}
                  </a>
                </div>
              </div> */}
              {!cookie("udid") && (
                <div className="alert alert-info shadow-lg p-3 pb-2 md:p-2 gap-0 mb-4 font-medium">
                  <div className="alert-child">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current flex-shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>{translationList?.welcome}</span>
                  </div>
                  <a className="alert-btn" href="/purchase">
                    {translationList?.get_started}
                  </a>
                </div>
              )}
              <div className="alert alert-info shadow-lg p-3 pb-2 md:p-2 gap-0 mb-4 font-medium bg-violet-500">
                <div className="alert-child">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current flex-shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>We are on TOR and I2P!</span>
                </div>
                <div className="alert-child">
                  <a className="alert-btn" href="http://signtunesjchffojqtmnngqgdwn4qtdpxrwg6t6ghjygqa2wjjvnlmyd.onion">
                    TOR
                  </a>
                  <a
                    className="alert-btn"
                    href="http://signtunes.i2p/?i2paddresshelper=hsetkcdjjwcedxdhgx4cokv33t2okipejolpum2lvvbncjijk5wq.b32.i2p"
                  >
                    I2P
                  </a>
                </div>
              </div>
              {cookie("udid") && alertOptions.deviceExists === true ? (
                !getUserLanguageCode().startsWith("en") ? (
                  <div className="alert alert-info shadow-lg p-3 pb-2 md:p-2 gap-0 mb-4 font-medium">
                    <div className="alert-child">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current flex-shrink-0 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                        ></path>
                      </svg>
                      <span>{translationList?.help_translate}</span>
                    </div>
                    <a className="alert-btn" href="https://crowdin.com/project/signtunes">
                      {translationList?.translate}
                    </a>
                  </div>
                ) : alertOptions.isPro === false ? (
                  <div className="alert alert-success shadow-lg p-3 pb-2 md:p-2 gap-0 mb-4 font-medium">
                    <div className="alert-child">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current flex-shrink-0 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>All the benefits of Signtunes & More</span>
                    </div>
                    <a className="alert-btn" href={`/pro${referral ? `?referral=${referral}` : ""}`}>
                      Get Pro
                    </a>
                  </div>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
              {cookie("udid") && isRegistered && !email.length && (
                <div
                  aria-hidden="true"
                  className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full bg-[#000000db] h-[100vh]"
                >
                  <div className="relative w-full h-full max-w-2xl md:h-auto m-auto">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Email Required</h3>
                      </div>
                      <div className="p-6 space-y-6">
                        <div id="email_confirmation" className="m-0">
                          <h3 className="text-xl font-semibold">Email</h3>
                          <p>Please enter your email address.</p>
                          <input
                            className="rounded-lg border-gray-200 text-sm placeholder-gray-400 focus:z-10 bg-gray-100 p-1.5 w-full text-black"
                            placeholder="Email"
                            type="email"
                            id="email"
                            required
                            value={email}
                          />
                          <button
                            className="block text-center w-[100%] rounded-md bg-primary  hover:bg-secondaryborder-none px-5 py-2.5 text-sm font-medium text-white shadow mt-4 mb-8"
                            id="check_email"
                            onClick={async () => {
                              if (email.trim().length < 1) alert("Email required");
                              else {
                                const response = await axios.post(`https://api2.starfiles.co/device/${cookie("udid")}`, { email: document.getElementById("email").value });
                                if (response?.data?.status) setEmailSuccess({ success: true, message: "" });
                                else setEmailSuccess({ success: false, message: response.data?.message });
                                setEmail(response.data?.email);
                                setEmailSubmitted(true);
                              }
                            }}
                          >
                            Submit
                          </button>
                        </div>
                        {emailSubmitted && (emailSuccess.success ? (
                          <div id="success" className="flex flex-col text-center gap-2 m-0">
                            <h3 className="text-xl font-semibold">Email Successfully Linked</h3>
                            <p>Your email has been successfully linked to your UDID.</p>
                            <a className="btn btn-sm bg-primary hover:bg-secondary border-none text-white" href="?">
                              Close
                            </a>
                          </div>
                        ) : (
                          <div id="error" className="m-0">
                            <h3 className="text-xl font-semibold">An Error Occurred</h3>
                            {emailSuccess?.message && <p id="error_message">{emailSuccess?.message}</p>}
                            <a className={`btn btn-sm bg-primary hover:bg-secondary`} href="?">
                              Retry
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <aside aria-label="Sidebar" className="hidden xl:block xl:col-span-1">
            <ul className="px-3 py-4 bg-gray-50 dark:bg-gray-800 mr-4 rounded-lg space-y-2" id="categories">
              <li>
                <button
                  onClick={() => {
                    getGenre(false);
                    setCurrentClicked("All");
                  }}
                  loader-ignore-click="true"
                  className={`px-1 py-2 text-base text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 w-[100%] text-left overflow-hidden text-ellipsis whitespace-nowrap ${
                    currentClicked === "All" ? "bg-gray-200 dark:bg-gray-700" : ""
                  }`}
                >
                  {/* <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>  */}
                  <span className="ml-3">{translationList?.All ?? "All"}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    getGenre("");
                    setCurrentClicked("Jailbreak");
                  }}
                  loader-ignore-click="true"
                  className={`px-1 py-2 text-base text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 w-[100%] text-left overflow-hidden text-ellipsis whitespace-nowrap ${
                    currentClicked === "Jailbreak" ? "bg-gray-200 dark:bg-gray-700" : ""
                  }`}
                >
                  {/* <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>  */}
                  <span className="ml-3">{translationList?.Jailbreak ?? "Jailbreak"}</span>
                </button>
              </li>
              {categories.map((genre, index) => {
                return (
                  <li key={index + genre}>
                    <button
                      onClick={() => {
                        getGenre(genre);
                        setCurrentClicked(genre);
                      }}
                      loader-ignore-click="true"
                      className={`px-1 py-2 text-base text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 w-[100%] text-left overflow-hidden text-ellipsis whitespace-nowrap ${
                        currentClicked === genre ? "bg-gray-200 dark:bg-gray-700" : ""
                      }`}
                    >
                      <span className="ml-3">{genre}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
          {mainContentLoad && (
            <div className="col-span-6 xl:col-span-5" id="maincontent">
              {statsLoad && (
                <dl
                  className="grid grid-cols-3 gap-2 px-4 pb-4 text-center text-gray-900 dark:text-white md:hidden"
                  id="stats_1"
                >
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-semibold" id="upload_count_1">
                      {count.uploadCount}
                    </dt>
                    <dd className="font-light text-gray-500 dark:text-gray-400">{translationList?.ipas_hosted}</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-semibold" id="download_count_1">
                      {count.downloadCount}
                    </dt>
                    <dd className="font-light text-gray-500 dark:text-gray-400">{translationList?.ipas_served}</dd>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl font-semibold" id="size_uploaded_1">
                      {count.sizeUpload}
                    </dt>
                    <dd className="font-light text-gray-500 dark:text-gray-400">{translationList?.ipas_stored}</dd>
                  </div>
                </dl>
              )}
              <ul
                className="flex flex-row gap-x-2 gap-y-2 text-sm font-medium  xl:hidden col-span-4 py-1 px-2 flex-wrap rounded-lg"
                id="categories_mobile"
              >
                <li>
                  <button
                    className={`text-gray-900 dark:text-white hover:underline py-1 px-2 rounded-lg ${
                      currentClicked === "All" ? "bg-gray-200 dark:bg-gray-700" : ""
                    } text-xs md:text-[16px]`}
                    onClick={() => {
                      getGenre(false);
                      setCurrentClicked("All");
                    }}
                    loader-ignore-click="true"
                  >
                    {translationList?.All ?? "All"}
                  </button>
                </li>
                <li>
                  <button
                    className={`text-gray-900 dark:text-white hover:underline py-1 px-2 rounded-lg ${
                      currentClicked === "Jailbreak" ? "bg-gray-200 dark:bg-gray-700" : ""
                    } text-xs md:text-[16px]`}
                    onClick={() => {
                      getGenre("");
                      setCurrentClicked("Jailbreak");
                    }}
                    loader-ignore-click="true"
                  >
                    {translationList?.Jailbreak ?? "Jailbreak"}
                  </button>
                </li>
                {categories.map((genre, index) => {
                  if (index < 5) {
                    return (
                      <li key={index}>
                        <button
                          className={`text-gray-900 dark:text-white hover:underline py-1 px-2 rounded-lg ${
                            currentClicked === genre ? "bg-gray-200 dark:bg-gray-700" : ""
                          } text-xs md:text-[16px]`}
                          onClick={() => {
                            getGenre(genre);
                            setCurrentClicked(genre);
                          }}
                          loader-ignore-click="true"
                        >
                          {genre}
                        </button>
                      </li>
                    );
                  } else return <></>;
                })}
              </ul>
              {genreData?.popular?.length > 0 && (
                <>
                  <h2 className="text-3xl font-semibold mb-2">{translationList?.popular}</h2>
                  <div className="w-full">
                    <div className="flex flex-wrap gap-x-2 gap-y-2 xl:gap-x-4 xl:gap-y-3" id="popular_apps">
                      {genreData.popular.map((app, index) => {
                        if (
                          app.bundle_id &&
                          !app.bundle_id.includes("co.starfiles.") &&
                          !app.bundle_id.includes("RANDOM")
                        ) {
                          const name = (app.clean_name || app.package_name || app.name.replace(".ipa", "")).trim();
                          return (
                            <Link
                              key={index}
                              href={`/app/${app.id}`}
                              className="rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out md:w-24 w-14"
                            >
                              <img
                                width={96}
                                height={96}
                                className="shadow rounded-[24%] w-14 h-14 md:!h-20 md:!w-20 xl:!h-24 xl:!w-24 align-middle border-none"
                                alt=""
                                src={`https://sts.st/bi/${app.bundle_id}`}
                                loading="lazy"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // Prevent infinite loop if fallback URL also fails
                                  currentTarget.src = defaultIconUrl; // Set to fallback URL directly
                                }}
                              />
                              <p
                                className="font-semibold md:!text-base text-xs truncate
                                md:w-24 w-14 mt-1 "
                              >
                                {name}
                              </p>
                            </Link>
                          );
                        } else return <></>;
                      })}
                    </div>
                  </div>
                </>
              )}
              <hr className="h-px mb-3 mt-7 bg-blue-300 opacity-35 border-0 w-[calc(100%-40px)] m-auto" />
              {genreData?.trending?.length > 0 && (
                <>
                  <h2 className="text-3xl font-semibold mb-2">{translationList?.recommended}</h2>
                  <div className="w-full">
                    <div className="flex flex-wrap gap-x-2 gap-y-2 xl:gap-x-4 xl:gap-y-3" id="trending_apps">
                      {genreData.trending.map((app, index) => {
                        if (
                          app.bundle_id &&
                          !app.bundle_id.includes("co.starfiles.") &&
                          !app.bundle_id.includes("RANDOM")
                        ) {
                          const name = (app.clean_name || app.package_name || app.name.replace(".ipa", "")).trim();
                          return (
                            <Link
                              key={index}
                              href={`/app/${app.id}`}
                              className="rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out md:w-24 w-14"
                            >
                              <img
                                width={96}
                                height={96}
                                className="shadow rounded-[24%] w-14 h-14 md:!h-20 md:!w-20 xl:!h-24 xl:!w-24 align-middle border-none"
                                alt=""
                                src={`https://sts.st/bi/${app.bundle_id}`}
                                loading="lazy"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // Prevent infinite loop if fallback URL also fails
                                  currentTarget.src = defaultIconUrl; // Set to fallback URL directly
                                }}
                              />
                              <p
                                className="font-semibold md:!text-base text-xs truncate
                                md:w-24 w-16 mt-1 "
                              >
                                {name}
                              </p>
                            </Link>
                          );
                        } else return <></>;
                      })}
                    </div>
                  </div>
                </>
              )}
              <hr className="h-px mb-3 mt-7 bg-blue-300 opacity-35 border-0 w-[calc(100%-40px)] m-auto" />
              {genreData?.upload_time?.length > 0 && (
                <>
                  <h2 className="text-3xl font-semibold mb-2">{translationList?.new}</h2>
                  <div className="w-full">
                    <div className="flex flex-wrap gap-x-2 gap-y-2 xl:gap-x-4 xl:gap-y-3" id="upload_time_apps">
                      {genreData.upload_time.map((app, index) => {
                        if (
                          app.bundle_id &&
                          !app.bundle_id.includes("co.starfiles.") &&
                          !app.bundle_id.includes("RANDOM")
                        ) {
                          const name = (app.clean_name || app.package_name || app.name.replace(".ipa", "")).trim();
                          return (
                            <Link
                              key={index}
                              href={`/app/${app.id}`}
                              className="rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out md:w-24 w-14"
                            >
                              <img
                                width={96}
                                height={96}
                                className="shadow rounded-[24%] w-14 h-14 md:!h-20 md:!w-20 xl:!h-24 xl:!w-24 align-middle border-none"
                                alt=""
                                src={`https://sts.st/bi/${app.bundle_id}`}
                                loading="lazy"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // Prevent infinite loop if fallback URL also fails
                                  currentTarget.src = defaultIconUrl; // Set to fallback URL directly
                                }}
                              />
                              <p
                                className="font-semibold md:!text-base text-xs truncate
                                md:w-24 w-16 mt-1 "
                              >
                                {name}
                              </p>
                            </Link>
                          );
                        } else return <></>;
                      })}
                    </div>
                  </div>
                </>
              )}
              <hr className="h-px mb-3 mt-7 bg-blue-300 opacity-35 border-0 w-[calc(100%-40px)] m-auto" />
              {genreData?.apple_tv_apps?.length > 0 && (
                <>
                  <h2 className="text-3xl font-semibold mb-2">Apple TV</h2>
                  <div className="w-full">
                    <div className="flex flex-wrap gap-x-2 gap-y-2 xl:gap-x-4 xl:gap-y-3" id="apple_tv_apps">
                      {genreData.apple_tv_apps.map((app, index) => {
                        if (
                          app.bundle_id &&
                          !app.bundle_id.includes("co.starfiles.") &&
                          !app.bundle_id.includes("RANDOM")
                        ) {
                          const name = (app.clean_name || app.package_name || app.name.replace(".ipa", "")).trim();
                          return (
                            <Link
                              key={index}
                              href={`/app/${app.id}`}
                              className="rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out md:w-24 w-14"
                            >
                              <img
                                width={96}
                                height={96}
                                className="shadow rounded-[24%] w-14 h-14 md:!h-20 md:!w-20 xl:!h-24 xl:!w-24 align-middle border-none"
                                alt=""
                                src={`https://sts.st/bi/${app.bundle_id}`}
                                loading="lazy"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // Prevent infinite loop if fallback URL also fails
                                  currentTarget.src = defaultIconUrl; // Set to fallback URL directly
                                }}
                              />
                              <p
                                className="font-semibold md:text-base text-xs truncate
                                md:w-24 w-16 mt-1 "
                              >
                                {name}
                              </p>
                            </Link>
                          );
                        } else return <></>;
                      })}
                    </div>
                  </div>
                </>
              )}
              {/* <h2 className="text-3xl font-semibold mb-1">Leaked Apps</h2>
                  <p className="mb-2">Leaked apps from the official source. These apps are either Testflight apps or enterprise signed (from the source), so no revokes.</p>
                  <div className="flex md:gap-8 gap-3 overflow-x-scroll" id="leaked_apps"></div> */}
            </div>
          )}
        </div>
        <div className="hidden md:block md:ml-3" id="sidebar">
          {statsLoad && (
            <dl
              className="grid grid-cols-3 md:gap-8 gap-2 px-4 pb-4 xl:pb-6 xl:px-4 text-center text-gray-900 dark:text-white"
              id="stats_2"
            >
              <div className="flex flex-col items-center justify-center">
                <dt
                  className="mb-2 md:text-xl lg:text-3xl xl:text-4xl md:font-bold xl:font-extrabold"
                  id="upload_count_2"
                >
                  {count.uploadCount}
                </dt>
                <dd className="font-light text-gray-500 dark:text-gray-400">{translationList?.ipas_hosted}</dd>
              </div>
              <div className="flex flex-col items-center justify-center">
                <dt
                  className="mb-2 md:text-xl lg:text-3xl xl:text-4xl md:font-bold xl:font-extrabold"
                  id="download_count_2"
                >
                  {count.downloadCount}
                </dt>
                <dd className="font-light text-gray-500 dark:text-gray-400">{translationList?.ipas_served}</dd>
              </div>
              <div className="flex flex-col items-center justify-center">
                <dt
                  className="mb-2 md:text-xl lg:text-3xl xl:text-4xl md:font-bold xl:font-extrabold"
                  id="size_uploaded_2"
                >
                  {count.sizeUpload}
                </dt>
                <dd className="font-light text-gray-500 dark:text-gray-400">{translationList?.ipas_stored}</dd>
              </div>
            </dl>
          )}
          {/* <div className="rounded-xl shadow-md bg-gray-100 dark:bg-gray-900 mb-4">
            <div className="grid grid-cols-6">
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.rockstargames.bully"
                className="w-[100%] rounded-tl-xl"
              />
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.rockstargames.gtachinatownwars"
                className="w-[100%]"
              />
              <img width={96} height={96} src="https://sts.st/bi/com.rockstargames.gta3sa" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/com.rockstargames.gta3vc" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/com.rockstargames.gta3ios" className="w-[100%]" />
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.rockstargames.maxpayne"
                className="w-[100%] rounded-tr-xl"
              />
            </div>
            <div className="p-4">
              <a href="/staff_picks/rockstar">
                <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Rockstar Games</h3>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                All your favourite games from Rockstar!
              </p>
              <div className="card-actions justify-end">
                <a href="/staff_picks/rockstar" className="btn bg-primary hover:bg-secondary text-white border-none">
                  {translationList?.browse}
                </a>
              </div>
            </div>
          </div> */}
          {/* <div className="rounded-xl shadow-md bg-gray-100 dark:bg-gray-900 mb-4">
            <div className="grid grid-cols-6">
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.lightricks.Enlight-Video"
                className="w-[100%] rounded-tl-xl"
              />
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.lightricks.Enlight-Phoenix"
                className="w-[100%]"
              />
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.lightricks.Enlight-Editor"
                className="w-[100%]"
              />
              <img width={96} height={96} src="https://sts.st/bi/com.lightricks.Lightwave" className="w-[100%]" />
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.lightricks.Enlight-Photos"
                className="w-[100%]"
              />
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.lightricks.Enlight-Quickart"
                className="w-[100%] rounded-tr-xl"
              />
            </div>
            <div className="p-4">
              <a href="/staff_picks/lightricks_editors">
                <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Lightricks Editors
                </h3>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                Amazing photo and video editors on your phone!
              </p>
              <div className="card-actions justify-end">
                <a
                  href="/staff_picks/lightricks_editors"
                  className="btn bg-primary hover:bg-secondary text-white border-none"
                >
                  {translationList?.browse}
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-xl shadow-md bg-gray-100 dark:bg-gray-900 mb-4">
            <div className="grid grid-cols-8">
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.google.ios.youtube"
                className="w-[100%] rounded-tl-xl"
              />
              <img width={96} height={96} src="https://sts.st/bi/com.firecore.infuse" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/science.xnu.undecimus" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/nz.co.codepoint.minimetro" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/com.burbn.instagram" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/ru.xitrix.iTorrent" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/com.odysseyteam.taurine" className="w-[100%]" />
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.hammerandchisel.discord"
                className="w-[100%] rounded-tr-xl"
              />
              <img width={96} height={96} src="https://sts.st/bi/net.Foddy.GettingOverIt" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/com.ustwo.monumentvalley2" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/com.mojang.minecraftpe" className="w-[100%]" />
              <img
                width={96}
                height={96}
                src="https://sts.st/bi/com.ndemiccreations.plagueinc"
                className="w-[100%]"
              />
              <img width={96} height={96} src="https://sts.st/bi/com.spotify.client" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/com.zhiliaoapp.musically" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/com.libretro.RetroArch" className="w-[100%]" />
              <img width={96} height={96} src="https://sts.st/bi/com.soundcloud.TouchApp" className="w-[100%]" />
            </div>
            <div className="p-4">
              <a href="/staff_picks/best_apps_to_sideload">
                <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Best Apps to Sideload
                </h3>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {translationList?.check_out_top_picks_2023}
              </p>
              <div className="card-actions justify-end">
                <a
                  href="/staff_picks/best_apps_to_sideload"
                  className="btn bg-primary hover:bg-secondary text-white border-none"
                >
                  {translationList?.browse}
                </a>
              </div>
            </div>
          </div> */}
          <div className="card bg-gray-100 dark:bg-gray-900 shadow-xl mb-4">
            <div className="card-body p-4">
              <h3 className="card-title text-2xl text-gray-900 dark:text-white">
                {translationList?.appletv_mac_support_title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">{translationList?.appletv_mac_support}</p>
              <div className="card-actions justify-end">
                <a href="/apple_tv" className="btn bg-primary hover:bg-secondary text-white border-none">
                  Apple TV
                </a>
                <a href="/mac" className="btn bg-primary hover:bg-secondary text-white border-none">
                  Mac
                </a>
              </div>
            </div>
          </div>
          <div className="card bg-gray-100 dark:bg-gray-900 shadow-xl mb-4">
            <div className="card-body p-4">
              <h3 className="card-title text-2xl text-gray-900 dark:text-white">IPA Finder</h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">{translationList?.ipa_finder_description}</p>
              <div className="card-actions justify-end">
                <a
                  href="https://api.starfiles.co/shortcuts/ipafinder"
                  className="btn bg-primary hover:bg-secondary text-white border-none"
                >
                  {translationList?.install}
                </a>
              </div>
            </div>
          </div>
          <div className="card bg-gray-100 dark:bg-gray-900 shadow-xl mb-4">
            <div className="card-body p-4">
              <h3 className="card-title text-2xl text-gray-900 dark:text-white">Hidden Services</h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                We are facing increased censorship. Please save our TOR or I2P address in-case Signtunes becomes
                inaccessible for you.
              </p>
              <p className="text-[12px] break-words max-w-[250px] text-gray-700 dark:text-gray-400">
                signtunesjchffojqtmnngqgdwn4qtdpxrwg6t6ghjygqa2wjjvnlmyd.onion
              </p>
              <p className="text-[12px] break-words max-w-[250px] text-gray-700 dark:text-gray-400">
                hsetkcdjjwcedxdhgx4cokv33t2okipejolpum2lvvbncjijk5wq.b32.i2p
              </p>
              <div className="card-actions justify-end">
                <a
                  href="http://signtunesjchffojqtmnngqgdwn4qtdpxrwg6t6ghjygqa2wjjvnlmyd.onion"
                  className="btn bg-primary hover:bg-secondary text-white border-none"
                >
                  TOR
                </a>
                <a
                  href="http://signtunes.i2p/?i2paddresshelper=CGkuFYA2enzyTvUfI8ugCIedbAWVq-amHbvkgt4AQX3XH-ZSEq2odCkJH-ojWnOGxb7t2PjUgPj8pf9MoTIT4dNH9h0z09VWwyiiDmmcdBnbtAyE6bqYh0z1g0W5amh8et0XAHNWuUgVpdWY7V4GXk0p9dkq~ffd-TA6ZOzB4U22NlAZDuxOF3bfU3YXDSjRpVmp61tGY9KT5AWTbSA8koyP0W42Dr~iG386VHClBh9nCMdgJxGagMDeF1dql2SikgAQzDBssKsWL9K0ucUi6Pmg0s1gU30N4uaBAWVkaFhDlOO9qwBnKvXUl0Pvk7lB1kbJnUwP56fP-c8hGZEyNkSpRLJLfFs-bnbIEYoRkoGrzV6fXE9UhdMoF5C2CwXd6yUK7bb05QlwfGmjD-ij7ys5MZiskszX8tGMMuBOGa9yt8M1B4vkFTKZqaNRD4hLCQthaBFCTI6NNoEuiJH12WRT0MzOAh8igaZYjrAUXO7saHIFOHvIbwyaaI8YxSV7BQAEAAcAAA=="
                  className="btn bg-primary hover:bg-secondary text-white border-none"
                >
                  I2P
                </a>
              </div>
            </div>
          </div>
          {/* <div className="card bg-gray-100 dark:bg-gray-900 shadow-xl mb-4">
                    <div className="card-body p-4">
                        <h2 className="card-title">Become a Reseller</h2>
                        <p>Get discounted pricing at bulk and sell at any price.</p>
                        <div className="card-actions justify-end">
                            <button className="btn">Join</button>
                        </div>
                    </div>
                </div> */}
        </div>
      </main>
    </>
  );
}
