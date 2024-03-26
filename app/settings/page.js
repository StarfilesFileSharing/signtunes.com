"use client";
import cookie, { setCookie } from "@/utils/cookies";
import { getTranslations } from "@/utils/getTranslation";
import axios from "axios";
import { useEffect, useState } from "react";
import TitleTags from "../components/Title";

function Settings({ searchParams }) {
  const { current } = searchParams;
  const [translationList, setTranslationList] = useState(null);
  const [currentSetting, setCurrentSetting] = useState(current ? current : "devices");
  const [email, setEmail] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailOutput, setEmailOutput] = useState("");
  const [udidExists, setUdidExists] = useState(false);
  const [noDeviceFound, setNoDeviceFound] = useState(false);
  const [devices, setDevices] = useState([]);
  const [deviceCertificate, setDeviceCertificate] = useState(null);
  const [permissions, setPermissions] = useState(null);

  let isCalled = false;

  useEffect(() => {
    if (!isCalled) {
      isCalled = true;
      // Get Translations
      getTranslationList();
      // Check Udid Exists
      getUdid();
      // Get Data
      getData();
    }
  }, []);

  useEffect(() => {
    if (currentSetting === "configure") {
      getEmail();
    }
  }, [currentSetting]);

  // Get Translations
  const getTranslationList = async () => {
    try {
      const translations = await getTranslations();
      setTranslationList(translations);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Get Udid
  const getUdid = async () => {
    if (document.cookie.indexOf("udid") !== -1) {
      setUdidExists(true);
      // Is pro
      const pro = await axios.get("https://api.starfiles.co/device_enrolments/is_pro?udid=" + cookie("udid"));
      if (pro.data) {
        setIsPro(true);
        // Check for certificates
        const deviceCerts = await axios.get("https://api2.starfiles.co/device_certificate/" + cookie("udid"));
        if (deviceCerts.data) setDeviceCertificate(deviceCerts.data);
        // Check for permissions
        const perms = await axios.get(`https://api2.starfiles.co/check_enrolment/${cookie("udid")}?organisation=2`);
        if (perms.data) setPermissions(perms.data);
      }
    }
    if (document.cookie.indexOf("udid=") === -1) setNoDeviceFound(true);
  };

  // Get Email For Configuration
  const getEmail = async () => {
    try {
      const response = await axios.get("https://api2.starfiles.co/device_email?udid=" + cookie("udid"));
      const data = response.data;
      if (data.status == true) {
        setEmail(data.email);
        setCurrentEmail(data.email);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Delete Cookie
  function deleteCookie(name) {
    // if (get_cookie(name)) {
    document.cookie = name + "=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    window.location.reload();
    // }
  }

  // Auxillary Functions
  async function listDevices() {
    const response = await axios.get("https://api.starfiles.co/device_enrolments/list_devices?udid=" + cookie("udid"));
    const devices = await response.data;
    return devices;
  }

  function days_till_signed(signed_time) {
    signed_days_ago = (+new Date() / 1000 - signed_time) / 60 / 60 / 24;
    if (signed_days_ago > 17) eligible_in = Math.ceil(33 - signed_days_ago);
    else if (signed_days_ago > 10)
      eligible_in = Math.ceil(17 - signed_days_ago) + " or " + Math.ceil(33 - signed_days_ago);
    else
      eligible_in =
        Math.ceil(10 - signed_days_ago) +
        ", " +
        Math.ceil(17 - signed_days_ago) +
        " or " +
        Math.ceil(33 - signed_days_ago);
    return eligible_in;
  }

  // Get Data
  const getData = async () => {
    try {
      listDevices().then((devices) => {
        console.log(devices);
        setDevices(devices);
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <head>
        <TitleTags title="Settings - Signtunes" />
      </head>
      <div className="mx-5 md:mx-10 mt-5">
        <div className="grid grid-cols-6 gap-4">
          <aside aria-label="Sidebar" className="col-span-6 md:col-span-1">
            <ul className="px-3 py-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2" id="categories">
              <li>
                <a
                  href="#"
                  onClick={() => setCurrentSetting("devices")}
                  loader-ignore-click="true"
                  className={`block px-1 py-2 text-base text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 w-[100%] text-left overflow-hidden text-ellipsis whitespace-nowrap ${
                    currentSetting === "devices" ? "bg-gray-200 dark:bg-gray-700" : ""
                  }`}
                >
                  <span className="ml-3">Devices</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setCurrentSetting("certificates")}
                  loader-ignore-click="true"
                  className={`block px-1 py-2 text-base text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 w-[100%] text-left overflow-hidden text-ellipsis whitespace-nowrap ${
                    currentSetting === "certificates" ? "bg-gray-200 dark:bg-gray-700" : ""
                  }`}
                >
                  <span className="ml-3">Certificates</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setCurrentSetting("configure")}
                  loader-ignore-click="true"
                  className={`block px-1 py-2 text-base text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 w-[100%] text-left overflow-hidden text-ellipsis whitespace-nowrap ${
                    currentSetting === "configure" ? "bg-gray-200 dark:bg-gray-700" : ""
                  }`}
                >
                  <span className="ml-3">Configure</span>
                </a>
              </li>
              <li>
                <a
                  href="?"
                  onClick={() => deleteCookie("udid")}
                  loader-ignore-click="true"
                  className="block px-1 py-2 text-base text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 w-[100%] text-left overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <span className="ml-3">Logout</span>
                </a>
              </li>
            </ul>
          </aside>
          <div className="flex flex-col col-span-6 md:col-span-4 gap-4 text-center" id="page">
            {currentSetting === "devices" && (
              <>
                {noDeviceFound ? (
                  <h1 className="text-2xl font-semibold">No Devices Found</h1>
                ) : (
                  <div className="flex flex-col gap-2" id="devices">
                    {devices.map((device, index) => {
                      return (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700"
                        >
                          <div className="px-5 py-5">
                            <h5 className="flex justify-center items-center text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                              {device["name"]?.length ? device["name"] : device["udid"]}
                              {device["revoked"] ? (
                                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-1">
                                  REVOKED
                                </span>
                              ) : device["enrolled"] ? (
                                <span
                                  className={`${
                                    device["eligible"]
                                      ? `bg-green-100 text-green-800`
                                      : device["processed"]
                                      ? `bg-red-100 text-red-800`
                                      : `bg-yellow-100 text-yellow-800`
                                  } text-xs font-semibold px-2.5 py-0.5 rounded ml-1`}
                                >
                                  {device["eligible"] ? "ENABLED" : device["processed"] ? "INELIGIBLE" : "PROCESSING"}
                                </span>
                              ) : (
                                ``
                              )}
                            </h5>
                            {!device["signed"] && device["enrolled"] ? (
                              <ul className="steps mb-2">
                                <li className={`step w-24 md:w-32 ${device["enrolled"] ? ` step-primary` : ""}`}>
                                  Enrolled
                                </li>
                                <li className={`step w-24 md:w-32 ${device["processed"] ? ` step-primary` : ""}`}>
                                  Processed
                                  {!device["processed"] && device["signed_time"] ? (
                                    <>
                                      <br />
                                      Maximum{" "}
                                      {Math.round(
                                        (device["signed_time"] + 60 * 60 * 24 * 3 - +new Date() / 1000) / 60 / 60
                                      )}{" "}
                                      Hours
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </li>
                                <li className="step w-24 md:w-32">
                                  Eligible{" "}
                                  {device["processed"] ? (
                                    <>
                                      <br />
                                      {device["hold_expires"]
                                        ? device["hold_expires"]
                                        : days_till_signed(device["signed_time"])}{" "}
                                      Days
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </li>
                              </ul>
                            ) : (
                              ``
                            )}
                            <p>
                              {device["nice_idevice_model"]
                                ? device["nice_idevice_model"]
                                : device["model"]
                                ? device["model"]
                                : ""}{" "}
                              {device["ios_version"] ? (
                                <>
                                  {" "}
                                  -{" "}
                                  {device["is_apple_silicon"] == "yes"
                                    ? "mac"
                                    : device["model"].startsWith("AppleTV")
                                    ? "tv"
                                    : "i"}
                                  OS {device["ios_version"]}
                                  <br />
                                </>
                              ) : (
                                ""
                              )}
                            </p>
                            {typeof device["name"] != "undefined" && typeof device["udid"] != "undefined" ? (
                              <p className="text-sm mb-2">{device["udid"]}</p>
                            ) : (
                              ""
                            )}
                            {device["signed_till"] ? (
                              <p className="text-xs">
                                Expires In: {Math.ceil((device["signed_till"] - +new Date() / 1000) / 60 / 60 / 24)}{" "}
                                Days
                                <br />
                                Account: {device["developer_account"]}
                              </p>
                            ) : (
                              ""
                            )}
                            {device["plus_till"] && Date.parse(device["plus_till"]) < +new Date() ? (
                              <p className="text-xs mt-1">
                                AppDB Signs Left:
                                {device["free_signs_left"]}
                                <br />
                                {Date.parse(device["free_signs_reset_at"]) && device["free_signs_left"] < 30 ? (
                                  <>
                                    AppDB Signs Reset in
                                    {Math.round(
                                      (Date.parse(device["free_signs_reset_at"]) - +new Date()) / 1000 / 60 / 60 / 24,
                                      1
                                    )}
                                    Days
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                                Upgrade for unlimited signs through AppDB.
                              </p>
                            ) : (
                              ""
                            )}
                            <div className="flex gap-1 mt-2 justify-center">
                              {typeof device["status"] == "undefined" ? (
                                <a
                                  className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 text-center"
                                  href="/purchase"
                                >
                                  Purchase Signtunes
                                </a>
                              ) : (
                                <>
                                  {device["pro"] ? (
                                    <a
                                      href="/vip"
                                      className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 text-center"
                                    >
                                      Signtunes VIP
                                    </a>
                                  ) : (
                                    <a
                                      href="/pro"
                                      className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 text-center"
                                    >
                                      Signtunes PRO
                                    </a>
                                  )}
                                  {!device["link_token"] || !device["name"] ? (
                                    <a
                                      href="/link_appdb"
                                      className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 text-center"
                                    >
                                      Link AppDB
                                    </a>
                                  ) : device["plus_till"] && Date.parse(device["plus_till"]) < +new Date() ? (
                                    <a
                                      href="/appdb_plus"
                                      className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 text-center"
                                    >
                                      AppDB PLUS
                                    </a>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}
                            </div>
                            {device["udid"] && cookie("udid") != device["udid"] ? (
                              <button
                                onClick={() => {
                                  setCookie("udid", device["udid"], 365);
                                  window.location.reload();
                                }}
                                className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-8 py-3 text-center mt-2"
                              >
                                Switch
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mx-auto">
                  <a
                    className="rounded-md bg-[#0077B6] hover:bg-[#023E8A] px-2.5 py-2.5 text-lg font-medium text-white shadow"
                    href="/purchase"
                  >
                    <i className="fa-light fa-mobile"></i> Add Device
                  </a>
                </div>
              </>
            )}
            {currentSetting === "configure" && udidExists && (
              <div id="configure_page">
                <h1 className="text-2xl font-semibold">Configure</h1>
                <label for="email" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Change Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  className="my-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@email.com"
                  required
                />
                <button
                  type="submit"
                  onChange={async () => {
                    try {
                      if (email?.trim().length === 0) alert("Email required");
                      else {
                        const res = await axios.get(
                          "https://api.starfiles.co/device_enrolments/link_email?email=" +
                            email +
                            "&current_email=" +
                            currentEmail +
                            "&udid=" +
                            cookie("udid")
                        );
                        const response = res.data;
                        if (response.length == 0) {
                          setEmailOutput("Email Successfully Changed");
                        } else {
                          setEmailOutput(response);
                        }
                      }
                    } catch (err) {
                      console.error(err.message);
                    }
                  }}
                  id="check_email"
                  className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-fit mx-auto sm:w-auto px-5 py-2.5 text-center"
                >
                  Update
                </button>
                <p id="email_output">{emailOutput}</p>
              </div>
            )}
            {currentSetting === "certificates" && udidExists ? (
              <div id="certificates_content">
                {isPro ? (
                  !permissions?.registered || !permissions.enrolled || !permissions.signed ? (
                    <div className="mx-auto">
                      <a
                        className="rounded-md bg-[#0077B6] hover:bg-[#023E8A] px-2.5 py-2.5 text-lg font-medium text-white shadow"
                        href="/pro"
                      >
                        <i className="fa-light fa-mobile"></i> Purchase Pro
                      </a>
                    </div>
                  ) : (
                    <div>
                      {deviceCertificate?.length > 0 &&
                        Object.entries(deviceCertificate[0]).map(([key, value], index) => {
                          if (value) {
                            return (
                              <div className="mx-auto my-5">
                                <a
                                  className="rounded-md bg-[#0077B6] hover:bg-[#023E8A] px-2.5 py-2.5 text-lg font-medium text-white shadow"
                                  href={"https://download.starfiles.co/" + value}
                                >
                                  <i className="fa-light fa-mobile"></i>
                                  {key}
                                </a>
                              </div>
                            );
                          } else return <></>;
                        })}
                    </div>
                  )
                ) : (
                  <div className="mx-auto">
                    <a
                      className="rounded-md bg-[#0077B6] hover:bg-[#023E8A] px-2.5 py-2.5 text-lg font-medium text-white shadow"
                      href="/pro"
                    >
                      <i className="fa-light fa-mobile"></i> Purchase Pro
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <>
                {currentSetting === "certificates" && (
                  <div className="mx-auto">
                    <a
                      className="rounded-md bg-[#0077B6] hover:bg-[#023E8A] px-2.5 py-2.5 text-lg font-medium text-white shadow"
                      href="/pro"
                    >
                      <i className="fa-light fa-mobile"></i> Purchase Pro
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="hidden md:block col-span-1">
            <div className="rounded-xl shadow-md bg-gray-100 dark:bg-gray-900">
              <div className="grid grid-cols-6">
                <img src="//sts.st/bi/com.lightricks.Enlight-Video" loading="lazy" className="w-[100%] rounded-tl-xl" />
                <img src="//sts.st/bi/com.lightricks.Enlight-Phoenix" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.lightricks.Enlight-Editor" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.lightricks.Lightwave" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.lightricks.Enlight-Photos" loading="lazy" className="w-[100%]" />
                <img
                  src="//sts.st/bi/com.lightricks.Enlight-Quickart"
                  loading="lazy"
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
                    Browse
                  </a>
                </div>
              </div>
            </div>
            <div className="rounded-xl shadow-md bg-gray-100 dark:bg-gray-900 mt-4">
              <div className="grid grid-cols-8">
                <img src="//sts.st/bi/com.google.ios.youtube" loading="lazy" className="w-[100%] rounded-tl-xl" />
                <img src="//sts.st/bi/com.hammerandchisel.discord" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.burbn.instagram" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.zhiliaoapp.musically" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.spotify.client" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.soundcloud.TouchApp" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/science.xnu.undecimus" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.odysseyteam.taurine" loading="lazy" className="w-[100%] rounded-tr-xl" />
                <img src="//sts.st/bi/net.Foddy.GettingOverIt" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.mojang.minecraftpe" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.ustwo.monumentvalley2" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/nz.co.codepoint.minimetro" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.ndemiccreations.plagueinc" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.firecore.infuse" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/ru.xitrix.iTorrent" loading="lazy" className="w-[100%]" />
                <img src="//sts.st/bi/com.libretro.RetroArch" loading="lazy" className="w-[100%]" />
              </div>
              <div className="p-4">
                <a href="/staff_picks/best_apps_to_sideload">
                  <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Best Apps to Sideload
                  </h3>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Check out our top picks of apps for 2023!
                </p>
                <div className="card-actions justify-end">
                  <a
                    href="/staff_picks/best_apps_to_sideload"
                    className="btn bg-primary hover:bg-secondary text-white border-none"
                  >
                    Browse
                  </a>
                </div>
              </div>
            </div>
            <div className="card bg-gray-100 dark:bg-gray-900 shadow-xl mt-4">
              <div className="card-body p-4">
                <h3 className="card-title text-2xl text-gray-900 dark:text-white">Now on Apple TV & Mac!</h3>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Signtunes now supports tvOS & macOS! Install custom iOS apps on your Mac or TV using Signtunes.
                </p>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
