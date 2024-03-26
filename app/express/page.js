"use client";
import cookie, { setCookie } from "@/utils/cookies";
import { getTranslations } from "@/utils/getTranslation";
import { useEffect, useState } from "react";
import TitleTags from "../components/Title";

function ProPurchaseButton({ purchaseButton = <></>, searchParams }) {
  const { referral, id } = searchParams;

  return (
    <form action="https://api.starfiles.co/payments/purchase" method="POST">
      <input type="hidden" name="type" value="subscription" />
      <input
        type="hidden"
        name="item_name"
        value={`Signtunes 1 Year (Express)${id ? ` (${id.charAt(0).toUpperCase() + id.slice(1)})` : ""}`}
      />
      <input type="hidden" name="item_number" value={`signtunes_express${id ? "_r_" + id + ")" : ""}`} />
      <input type="hidden" name="currency_code" value="USD" />

      {/* Set the terms of the regular subscription.  */}
      <input type="hidden" name="price" value={process.env.NEXT_PUBLIC_SIGNTUNES_EXPRESS_PRICE_YEARLY} />
      <input type="hidden" name="p3" value="1" />
      <input type="hidden" name="t3" value="Y" />

      <input type="hidden" name="cancel_return" value="https://signtunes.com" />
      <input type="hidden" name="return" value="https://signtunes.com/success" />

      <input type="hidden" name="platform_name" value="Signtunes" />
      <input type="hidden" name="platform_colour" value="#343a40" />
      <input type="hidden" name="platform_accent" value="#007bff" />
      <input type="hidden" name="platform_background" value="#e9ecef" />

      {referral && <input type="hidden" name="referral" value={referral} />}
      {purchaseButton}
    </form>
  );
}

function Express({ searchParams }) {
  const [translationList, setTranslationList] = useState(null);
  let isCalled = false;

  useEffect(() => {
    if (!isCalled) {
      isCalled = true;
      // Get Translations
      getTranslationList();
      // Check Cookie
      // checkCookie();
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

  // Check Cookie
  // TODO page referral
  const checkCookie = () => {
    let referral = window.location.href.replace(/\/+$/, "").split("/").slice(-1)[0];
    if (referral !== "purchase" && cookie("referral") === null) setCookie("referral", referral, 7);
    if (cookie("referral") !== referral) window.location.href = "/purchase/" + cookie("referral");
  };

  return (
    <>
      <head>
        <TitleTags title="Purchase Signtunes Express" />
      </head>
      <div className="mx-5 md:mx-10 mt-5">
        <h1 className="text-5xl font-extrabold dark:text-white text-center">
          Signtunes
          <span className="bg-lime-200 text-lime-800 text-2xl font-semibold mx-2 px-2.5 py-0.5 rounded">Express</span>
        </h1>
        <h2 className="m-2 mb-0 text-xl text-neutral-600 text-center dark:text-gray-200">
          Skip hold times on new devices.
        </h2>
        <ProPurchaseButton
          searchParams={searchParams}
          purchaseButton={
            <button
              className="flex m-auto mb-4 rounded-md hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow bg-primary"
              type="submit"
            >
              <span>Buy Express</span>&nbsp;${process.env.NEXT_PUBLIC_SIGNTUNES_EXPRESS_PRICE_YEARLY}
              <span>{translationList?.per_year}</span>
            </button>
          }
        />
        <div className="block lg:mx-96 mb-12 dark:text-gray-900 rounded-xl p-8 shadow-xl bg-bright">
          <h3 className="text-xl font-semibold">What is Signtunes Express?</h3>
          <p className="text-lg mb-4">Signtunes Express completely skips hold times on new devices.</p>
          <h3 className="text-xl font-semibold">How does Signtunes Express work?</h3>
          <p className="text-lg mb-4">
            Apple tends to put devices on "hold", forcing users to wait before installing apps. Signtunes Express
            completely skips the 72 hour processing time. Do note that devices that have been caught previously breaking
            Apple's terms of service may still face an ineligibility period of 7, 14, or 30 days.
          </p>
        </div>
      </div>
    </>
  );
}

export default Express;
