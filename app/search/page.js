"use client";
import { getTranslations } from "@/utils/getTranslation";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TitleTags from "../components/Title";

function Search() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [translationList, setTranslationList] = useState(null);
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    // Get Translations
    getTranslationList();
    // Get Search Data
    getSearchData();
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

  // Search Data
  const getSearchData = async () => {
    try {
      const res = await axios.get(
        `https://api.starfiles.co/2.0/files?public=true&extension=ipa&group=bundle_id&collapse=true&limit=200&search=${
          q ? q : ""
        }`
      );
      setSearchData(res.data ?? []);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <head>
        <TitleTags title="Search" />
      </head>
      <div className="mx-5 md:mx-10 mt-5">
        <form className="p-0 hidden md:flex lg:hidden" action="/search">
          <div className="relative m-auto w-64">
            <input
              className="h-10 rounded-lg border-gray-200 pr-10 text-sm placeholder-gray-400 bg-gray-200 p-4 w-[100%]"
              placeholder="Search"
              type="text"
              name="q"
            />
            <button type="submit" className="absolute inset-y-0 right-0 mr-px rounded-r-lg p-2 text-gray-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  clip-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  fill-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </form>
        <h1 className="text-3xl font-semibold mb-2">{translationList?.search_results}</h1>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:md:grid-cols-8 gap-2" id="apps">
          {searchData ? (
            <>
              {searchData.map((app, index) => {
                let name =
                  app.package_name !== null && app.package_name.length > 0
                    ? app.package_name
                    : app.clean_name.length > 0
                    ? app.clean_name
                    : app.name;
                return (
                  <Link
                    href={`/app/${app?.id}`}
                    loader-ignore-click="true"
                    className="rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out md:w-28 w-20"
                    style={{ wordBreak: "break-word" }}
                    height="112"
                    key={index}
                  >
                    <img
                      src={`https://sts.st/bi/${app?.bundle_id}`}
                      alt={name}
                      className="shadow rounded-[24%] md:h-28 md:w-28 h-20 w-20 align-middle border-none"
                      loading="lazy"
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "https://cdn.starfiles.co/images/dark-icon.png";
                      }}
                    />
                    <p className="font-semibold md:text-base text-xs">{name}</p>
                    {/* <p className="text-sm">Company LLC</p> */}
                  </Link>
                );
              })}
            </>
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
        </div>
      </div>
    </>
  );
}

export default Search;
