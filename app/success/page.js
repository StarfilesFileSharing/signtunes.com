"use client";
import React, { useEffect, useState } from "react";
import TitleTags from "../components/Title";
import { useSearchParams } from "next/navigation";
import { getTranslations } from "@/utils/getTranslation";

function ProPurchaseButton({ purchaseButton = <></> }) {
  const searchParams = useSearchParams();
  const referral = searchParams.get("referral");

  return (
    <form action="https://api.starfiles.co/payments/purchase" method="POST">
      <input type="hidden" name="type" value="subscription" />
      <input type="hidden" name="item_name" value="Signtunes Pro" />
      <input type="hidden" name="item_number" value="signtunes_1y_pro" />
      <input type="hidden" name="currency_code" value="USD" />

      <input type="hidden" name="price" value={process.env.NEXT_PUBLIC_SIGNTUNES_PRO_PRICE} />
      <input type="hidden" name="p3" value="1" />
      <input type="hidden" name="t3" value="M" />

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

function Success() {
  const [translationList, setTranslationList] = useState(null);
  const searchParams = useSearchParams();
  const referral = searchParams.get("referral");

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
        <TitleTags title="Purchase Successfully Completed" />
      </head>
      <div className="mx-5 md:mx-10 mt-5">
        <div className="flex flex-col py-4 lg:pt-8 text-center">
          <h1 className="text-3xl font-bold leading-none text-neutral-800 dark:text-gray-100">
            Thank you for your purchase!
          </h1>
          <p className="m-2 mb-0 text-xl text-neutral-600 text-center dark:text-gray-300">
            You have been emailed instructions.
          </p>
        </div>
        <div className="text-center">
          <a href="/discord" className="inline-block w-auto mb-8 p-2 text-l rounded-3xl text-white bg-[#7289da]">
            <i className="fab fa-discord"></i> Support
          </a>
        </div>

        <ProPurchaseButton
          purchaseButton={
            <button
              className="flex m-auto mb-4 rounded-md hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow bg-primary"
              type={`submit${referral ? `?referral=${referral}` : ""}}`}
            >
              <span>{translationList?.join_signtunes_pro}</span>&nbsp;${process.env.NEXT_PUBLIC_SIGNTUNES_PRO_PRICE}
            </button>
          }
        />
        <div className="block lg:mx-96 mb-12 dark:text-gray-900 rounded-xl p-8 shadow-xl bg-bright">
          <h3 className="text-xl font-semibold">Get Certificate Files</h3>
          <p className="text-lg mb-4">As a pro member you get access to certificate files to use as you wish</p>
          <h3 className="text-xl font-semibold">Priority Support</h3>
          <p className="text-lg mb-4">Pro members get priority support from our support team</p>
          <h3 className="text-xl font-semibold">Early Access New Features</h3>
          <p className="text-lg mb-4">Get early access to new features before we release them to everyone else</p>
          <h3 className="text-xl font-semibold">Starfiles Silver</h3>
          <p className="text-lg mb-4">
            A Starfiles silver subscription (normally $5/month) is included free for all pro members
          </p>
          <h3 className="text-xl font-semibold">Special Discord Role</h3>
          <p className="text-lg mb-4">Get a special role on our Discord server for everyone to see</p>
          <ProPurchaseButton
            purchaseButton={
              <div className="flex justify-center">
                <button
                  className="rounded-md bg-primary hover:bg-[#023E8A] px-5 py-2.5 text-sm font-medium text-white shadow"
                  type={`submit${referral ? `?referral=${referral}` : ""}}`}
                >
                  Join Signtunes Pro
                </button>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
}

export default Success;
