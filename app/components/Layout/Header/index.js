"use client";
import cookie, { setCookie } from "@/utils/cookies";
import { getTranslations } from "@/utils/getTranslation";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Header({ searchParams }) {
  const referral = searchParams?.referral;
  // console.log("referral1", referral);
  const [translationList, setTranslationList] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [cookieChecked, setCookieChecked] = useState(false);
  const [devicesList, setDevicesList] = useState([]);
  const [deviceName, setDeviceName] = useState(null);
  const [hideDeviceName, setHideDeviceName] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);

  let isCalled = false;

  useEffect(() => {
    if (!isCalled) {
      isCalled = true;
      // Check Dark Theme
      checkDarkTheme();
      // Get Translations
      getTranslationList();
      // Check Cookie
      checkCookie();
    }
  }, []);

  useEffect(() => {
    checkCookie();
  }, [document.cookie.indexOf("udid=")]);

  // Check Dark THeme
  const checkDarkTheme = async () => {
    if (
      localStorage.getItem("color-theme") != "light" &&
      (localStorage.getItem("color-theme") == "dark" ||
        (!("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches))
    )
      setIsDarkTheme(true);
    else setIsDarkTheme(false);
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

  // Check Cookie If User Exists
  const checkCookie = async () => {
    if (document.cookie.indexOf("udid=") !== 1) {
      console.log("test1");
      try {
        if (cookie("pro") === null) {
          const response = await axios.get("https://api2.starfiles.co/pro?udid=" + cookie("udid"));
          setCookie("pro", `${response.data["status"]}`, 7);
        }
        console.log("test2");
        const devices = await axios.get("https://api2.starfiles.co/devices/" + cookie("udid"));
        setDevicesList(devices.data);
        if (devices.data?.length === 0) setDeviceName("");
        else {
          for (let device of devices.data) {
            if (device["udid"] == cookie("udid")) {
              if (device["name"] == device["udid"]) {
                setDeviceName(
                  device["nice_idevice_model"] ? (
                    device["nice_idevice_model"]
                  ) : (
                    <>
                      {device["model"] ? device["model"] : device["udid"]}
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
                    </>
                  )
                );
                setDeviceInfo(device["udid"]);
              } else {
                if (device["name"] == null) setHideDeviceName(true);
                else setDeviceName(device["name"]);
                setDeviceInfo(
                  device["nice_idevice_model"] ? (
                    device["nice_idevice_model"]
                  ) : (
                    <>
                      {device["model"] ? device["model"] : device["udid"]}
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
                    </>
                  )
                );
              }
            }
          }
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    setCookieChecked(true);
  };

  return (
    <header className="sticky navbar bg-white dark:text-white dark:bg-gray-900 px-5 md:px-12 py-0 justify-between top-0 z-10">
      <div className="navbar-start w-min">
        <div className="dropdown md:hidden">
          <label tabIndex="0" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 bg-white dark:bg-gray-900"
          >
            {document.cookie.indexOf("udid=") !== -1 && (
              <li className="nav_btn customer_only" tabIndex="0">
                <a className="p-2 active:bg-secondary" href="/signer">
                  {translationList?.signer}
                </a>
              </li>
            )}
            <li className="nav_btn" tabIndex="0">
              <a className="p-2 active:bg-secondary" href="/purchase">
                {translationList?.purchase}
              </a>
            </li>
            {document.cookie.indexOf("udid=") === -1 && (
              <li className="nav_btn" tabIndex="0">
                <a className="p-2 active:bg-secondary" href="/device_status" id="device_status_1">
                  {translationList?.device_status}
                </a>
              </li>
            )}
            {/* <li className="nav_btn" tabIndex="0">
              <a className="p-2 active:bg-secondary" href="/appdb_plus">
                AppDB PLUS
              </a>
            </li> */}
            <li className="nav_btn" tabIndex="0">
              <a className="p-2 active:bg-secondary" href="/mac">
                Mac
              </a>
            </li>
            <li className="nav_btn" tabIndex="0">
              <a className="p-2 active:bg-secondary" href="/apple_tv">
                Apple TV
              </a>
            </li>
            <li className="nav_btn" tabIndex="0">
              <a className="p-2 active:bg-secondary" href="/faq">
                {translationList?.faq}
              </a>
            </li>
            <li className="nav_btn" tabIndex="0">
              <a className="p-2 active:bg-secondary" href="https://signtunes.com/discord">
                {translationList?.support}
              </a>
            </li>
            <li className="nav_btn" tabIndex="0">
              <a className="p-2 active:bg-secondary" href="/blog">
                {translationList?.blog}
              </a>
            </li>
            {cookieChecked && document.cookie.indexOf("udid=") !== -1 && cookie("pro") === "false" && (
              <li className="nav_btn" id="upgrade_btn" tabIndex="0">
                <a
                  className="rounded-xl px-2 py-1 font-medium text-white shadow bg-gradient-to-r from-sky-400 to-emerald-600 mb-2 m-0"
                  href={`/pro${referral ? `?referral=${referral}` : ""}`}
                >
                  Signtunes Pro
                </a>
              </li>
            )}
            <li>
              <form className="flex p-0" action="/search">
                <div className="relative">
                  <input
                    className="h-10 rounded-lg border-gray-200 pr-10 text-sm placeholder-gray-400 focus:z-10 bg-gray-200 p-4 w-48 dark:bg-gray-600 dark:text-gray-200 dark:border-none dark:text-black"
                    placeholder={translationList?.search}
                    type="text"
                    name="q"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 mr-px rounded-r-lg p-2 text-gray-600 dark:text-gray-400"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </li>
          </ul>
        </div>
        <h1>
          <a
            className="block font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600"
            href="/"
            loader-ignore-click="true"
          >
            Signtunes
          </a>
        </h1>
        <form className="mb-0 ml-4 hidden lg:flex" action="/search">
          <div className="relative">
            <input
              className="h-10 rounded-lg border-gray-200 pr-10 text-sm placeholder-gray-400 focus:z-10 bg-gray-200 p-4 dark:bg-gray-600 dark:text-gray-200 dark:border-none dark:text-black"
              placeholder={translationList?.search}
              type="text"
              name="q"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 mr-px rounded-r-lg p-2 text-gray-600 dark:text-gray-400"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  fillRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
      <div className="navbar-end w-max">
        <div className="hidden md:block">
          <ul className="menu menu-horizontal px-1 text-[16px]">
            {document.cookie.indexOf("udid=") !== -1 && (
              <li className="nav_btn customer_only">
                <a className="p-2 active:bg-secondary" href="/signer">
                  {translationList?.signer}
                </a>
              </li>
            )}
            <li className="nav_btn" tabIndex="0">
              <a className="p-2 active:bg-secondary" href="/purchase">
                {translationList?.purchase}
              </a>
            </li>
            {document.cookie.indexOf("udid=") === -1 && (
              <li className="nav_btn">
                <a className="p-2 active:bg-secondary" href="/device_status" id="device_status_2">
                  {translationList?.device_status}
                </a>
              </li>
            )}
            {/* <li className="nav_btn">
              <a className="p-2 active:bg-secondary" href="/appdb_plus">
                AppDB PLUS
              </a>
            </li> */}
            <li className="nav_btn">
              <a className="p-2 active:bg-secondary" href="/mac">
                Mac
              </a>
            </li>
            <li className="nav_btn">
              <a className="p-2 active:bg-secondary" href="/apple_tv">
                Apple TV
              </a>
            </li>
            <li className="nav_btn">
              <a className="p-2 md:flex lg:hidden active:bg-secondary" href="/search">
                {translationList?.search}
              </a>
            </li>
            <li className="nav_btn">
              <a className="p-2 md:flex lg:hidden active:bg-secondary" href="/blog">
                {translationList?.blog}
              </a>
            </li>
            <li>
              <button
                id="help-dropdown-button"
                data-dropdown-toggle="help-dropdown"
                className="gap-0 p-2 active:bg-secondary"
                loader-ignore-click="true"
              >
                <span>{translationList?.help}</span>
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 ml-1 md:w-4 md:h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <ul
                aria-labelledby="help-dropdown-button"
                id="help-dropdown"
                className="hidden absolute z-10 text-sm rounded-lg shadow-md bg-white border border-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-700 text-gray-500 dark:text-gray-400"
              >
                <li>
                  <a
                    href="/faq"
                    className="nav_btn hover:text-blue-600 dark:hover:text-blue-500 active:bg-secondary active:text-white"
                  >
                    <span className="sr-only">FAQ</span>
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                      aria-hidden="true"
                      focusable={false}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {translationList?.faq}
                  </a>
                </li>
                <li>
                  <a
                    href="https://signtunes.com/discord"
                    className="nav_btn hover:text-blue-600 dark:hover:text-blue-500 active:bg-secondary active:text-white"
                  >
                    <span className="sr-only">Support</span>
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {translationList?.support}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <button
          id="theme-toggle"
          type="button"
          className="text-gray-500 dark:text-gray-400 text-sm mr-4"
          loader-ignore-click="true"
          onClick={() => {
            setIsDarkTheme((prev) => !prev);

            // if set via local storage previously
            if (localStorage.getItem("color-theme")) {
              if (localStorage.getItem("color-theme") === "light") {
                document.documentElement.classList.add("dark");
                localStorage.setItem("color-theme", "dark");
              } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("color-theme", "light");
              }

              // if NOT set via local storage previously
            } else {
              if (document.documentElement.classList.contains("dark")) {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("color-theme", "light");
              } else {
                document.documentElement.classList.add("dark");
                localStorage.setItem("color-theme", "dark");
              }
            }
          }}
        >
          {!isDarkTheme && (
            <svg
              id="theme-toggle-dark-icon"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
          {isDarkTheme && (
            <svg
              id="theme-toggle-light-icon"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        {cookieChecked && document.cookie.indexOf("udid=") !== -1 && cookie("pro") === "false" && (
          <a
            id="upgrade_btn_2"
            className="nav_btn rounded-md bg-primary hover:bg-secondary px-2.5 py-2.5 text-sm font-medium text-white mr-2 shadow bg-gradient-to-r from-sky-400 to-emerald-600"
            href={`/pro${referral ? `?referral=${referral}` : ""}`}
          >
            Signtunes Pro
          </a>
        )}
        <a
          className={`nav_btn ${
            document.cookie.indexOf("udid=") !== -1 ? "" : "hidden"
          } rounded-md bg-primary hover:bg-secondary px-2.5 py-2.5 text-sm font-medium text-white shadow flex gap-1`}
          href={"#"}
          id="dropdown_account_btn"
          data-dropdown-toggle={"dropdown_account"}
          loader-ignore-click={"true"}
        >
          {document.cookie.indexOf("udid=") !== -1 ? (
            <>
              <span>{translationList?.my_devices}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="mt-0.5 w-3 h-4"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </>
          ) : (
            translationList?.get_started
          )}
        </a>
        <div
          id="dropdown_account"
          className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            {!hideDeviceName && (
              <div id="device_name" className="overflow-hidden text-ellipsis">
                {deviceName ? deviceName : "Loading"}
              </div>
            )}
            <div id="device_info" className="font-medium truncate overflow-hidden text-ellipsis">
              {deviceInfo}
            </div>
          </div>
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown_account_btn">
            <li>
              <a
                href="/settings?current=devices"
                className="nav_btn block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                loader-ignore-click="true"
              >
                {translationList?.devices}
              </a>
            </li>
            <li>
              <a
                href="/settings?current=certificates"
                className="nav_btn block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                loader-ignore-click="true"
              >
                {translationList?.certificates}
              </a>
            </li>
            <li>
              <a
                href="/settings?current=configure"
                className="nav_btn block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                loader-ignore-click="true"
              >
                {translationList?.configure}
              </a>
            </li>
          </ul>
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdown_account_btn"
            id="menubar_device_list"
          >
            {document.cookie.indexOf("udid=") !== -1 &&
              devicesList.map((device, index) => {
                if (device["udid"] !== cookie("udid")) {
                  if (device["name"] == device["udid"]) {
                    return (
                      <li key={index}>
                        <button
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-[100%] text-left overflow-hidden text-ellipsis text-xs"
                          loader-ignore-click="true"
                          onclick="setCookie('udid', '` + device['udid'] + `', 365);window.location.reload()"
                        >
                          {device["nice_idevice_model"] ? (
                            device["nice_idevice_model"]
                          ) : (
                            <>
                              {device["model"] ? device["model"] : device["udid"]}
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
                            </>
                          )}
                          <br /> {device["udid"]}
                        </button>
                      </li>
                    );
                  } else {
                    return (
                      <li key={index}>
                        <button
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-[100%] text-left overflow-hidden text-ellipsis text-xs"
                          loader-ignore-click="true"
                          onclick="setCookie('udid', '` + device['udid'] + `', 365);window.location.reload()"
                        >
                          {device["name"]} <br />
                          {device["nice_idevice_model"] ? (
                            device["nice_idevice_model"]
                          ) : (
                            <>
                              {device["model"] ? device["model"] : device["udid"]}
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
                            </>
                          )}
                        </button>
                      </li>
                    );
                  }
                }
              })}
          </ul>
        </div>
        {document.cookie.indexOf("udid=") !== -1 ? (
          <></>
        ) : (
          <a
            className={`nav_btn rounded-md bg-primary hover:bg-secondary px-2.5 py-2.5 text-sm font-medium text-white shadow`}
            href={`/purchase${referral ? `?referral=${referral}` : ""}`}
            id="dropdown_account_btn"
            data-dropdown-toggle={""}
            loader-ignore-click={""}
          >
            {translationList?.get_started}
          </a>
        )}
      </div>
    </header>
  );
}

export default Header;
