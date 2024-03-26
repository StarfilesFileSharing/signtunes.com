"use client";
import { getTranslations } from "@/utils/getTranslation";
import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import TitleTags from "../components/Title";

function ProPurchaseButton({ purchaseButton = <></>, period = "monthly", searchParams }) {
  const { referral } = searchParams;

  return (
    <form action="https://api.starfiles.co/payments/purchase" method="POST">
      <input type="hidden" name="type" value="subscription" />
      <input type="hidden" name="item_name" value={`Signtunes Pro ${period == "yearly" ? "Yearly" : "Monthly"}`} />
      <input type="hidden" name="item_number" value={`signtunes_pro_${period == "yearly" ? "1y" : "1m"}`} />
      <input type="hidden" name="currency_code" value="USD" />

      {/* Set the terms of the regular subscription.  */}
      <input
        type="hidden"
        name="price"
        value={`${
          period === "yearly"
            ? process.env.NEXT_PUBLIC_SIGNTUNES_PRO_PRICE_YEARLY
            : process.env.NEXT_PUBLIC_SIGNTUNES_PRO_PRICE
        }`}
      />
      <input type="hidden" name="p3" value={`${period == "yearly" ? "1" : "4"}`} />
      <input type="hidden" name="t3" value={`${period == "yearly" ? "Y" : "W"}`} />

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

function Pro({ searchParams }) {
  const [translationList, setTranslationList] = useState(null);

  useEffect(() => {
    // Get Translations
    getTranslationList();
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

  return (
    <>
      <head>
        <TitleTags title="Purchase Signatures Pro" />
      </head>
      <Header searchParams={searchParams} />
      <div className="mx-5 md:mx-10 mt-5">
        <h1 className="text-5xl font-extrabold dark:text-white text-center">
          Signtunes
          <span className="bg-blue-100 text-blue-800 text-2xl font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2">
            PRO
          </span>
        </h1>
        <h2 className="m-2 mb-0 text-xl text-neutral-600 text-center dark:text-gray-200">
          {translationList?.signtunes_pro_benefits}
        </h2>
        <p className="text-center text-red-600 mb-4 text-sm">
          {translationList?.existing_signtunes_subscription_required}
        </p>
        <ProPurchaseButton
          purchaseButton={
            <button
              className="flex m-auto mb-4 rounded-md hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow bg-primary"
              type="submit"
            >
              <span>{translationList?.join_signtunes_pro}</span>&nbsp;${process.env.NEXT_PUBLIC_SIGNTUNES_PRO_PRICE}
            </button>
          }
          searchParams={searchParams}
        />
        <div className="block lg:mx-96 mb-12 dark:text-gray-900 rounded-xl p-8 shadow-xl bg-bright">
          <h3 className="text-xl font-semibold">{translationList?.get_certificate_files}</h3>
          <p className="text-lg mb-4">{translationList?.pro_member_certificate_files_access}</p>
          <h3 className="text-xl font-semibold">{translationList?.priority_support}</h3>
          <p className="text-lg mb-4">{translationList?.pro_members_priority_support_details}</p>
          <h3 className="text-xl font-semibold">{translationList?.early_access_new_features}</h3>
          <p className="text-lg mb-4">{translationList?.pro_members_early_access_features_details}</p>
          <h3 className="text-xl font-semibold">{translationList?.starfiles_silver_subscription}</h3>
          <p className="text-lg mb-4">{translationList?.pro_members_starfiles_silver_subscription_details}</p>
          <h3 className="text-xl font-semibold">{translationList?.special_discord_role}</h3>
          <p className="text-lg mb-4">{translationList?.pro_members_special_discord_role_details}</p>
          <div className="flex gap-1 justify-center">
            <ProPurchaseButton
              purchaseButton={
                <div className="flex justify-center">
                  <button
                    className="rounded-md bg-primary hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow"
                    type="submit"
                  >
                    Signtunes Pro ${process.env.NEXT_PUBLIC_SIGNTUNES_PRO_PRICE}
                  </button>
                </div>
              }
              searchParams={searchParams}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Pro;
