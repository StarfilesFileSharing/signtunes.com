"use client";
import { getTranslations } from "@/utils/getTranslation";
import { useEffect, useState } from "react";
import TitleTags from "../components/Title";

function SignerProgress() {
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
        <TitleTags title="Frequently Asked Questions" />
      </head>
      <div className="mx-5 mb-12 mt-24">
        <div class="text-center">
          <div class="duration-500" id="status">
            <p class="text-2xl font-semibold">Sit tight, we are signing your app!</p>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300 mt-4 max-w-[400px] mx-auto">
            <div
              class="bg-[#<?php echo $theme['primary'];?>] h-2.5 rounded-full"
              style="width:0%"
              id="progress_bar"
            ></div>
          </div>
          <div
            class="mt-4 mb-1 px-4 py-2 leading-none rounded-2xl bg-[hsl(var(--n))]"
            role="alert"
            style="display:none"
            id="app_feedback"
          >
            <div class="flex flex-col" id="app_feedback_initial_prompt">
              <span class="text-lg font-bold">Is the app working?</span>
              <p class="text-xs">Feedback helps improve our app suggestion algorithm.</p>
              <div class="flex justify-center mt-2 gap-4">
                <button
                  class="flex rounded-full bg-[#<?php echo $theme['primary'];?>] hover:bg-[#<?php echo $theme['secondary'];?>] uppercase px-8 py-2 text-xs font-bold"
                  id="app_feedback_working"
                >
                  Yes
                </button>
                <button
                  class="flex rounded-full bg-[#<?php echo $theme['primary'];?>] hover:bg-[#<?php echo $theme['secondary'];?>] uppercase px-8 py-2 text-xs font-bold"
                  id="app_feedback_broken"
                >
                  No
                </button>
              </div>
            </div>
            <div class="flex flex-col gap-2" id="app_feedback_reason" style="display:none">
              <span class="text-lg font-bold">What is the issue?</span>
              <div class="flex gap-1 justify-center flex-wrap">
                <button
                  class="flex rounded-full bg-[#<?php echo $theme['primary'];?>] hover:bg-[#<?php echo $theme['secondary'];?>] uppercase px-4 py-2 text-xs font-bold"
                  id="app_feedback_crash"
                >
                  Crashing
                </button>
                <button
                  class="flex rounded-full bg-[#<?php echo $theme['primary'];?>] hover:bg-[#<?php echo $theme['secondary'];?>] uppercase px-4 py-2 text-xs font-bold"
                  id="app_feedback_integrity"
                >
                  Integrity Error
                </button>
                <button
                  class="flex rounded-full bg-[#<?php echo $theme['primary'];?>] hover:bg-[#<?php echo $theme['secondary'];?>] uppercase px-4 py-2 text-xs font-bold"
                  id="app_feedback_unable"
                >
                  Unable to Install
                </button>
                <button
                  class="flex rounded-full bg-[#<?php echo $theme['primary'];?>] hover:bg-[#<?php echo $theme['secondary'];?>] uppercase px-4 py-2 text-xs font-bold"
                  id="app_feedback_other"
                >
                  Other
                </button>
              </div>
            </div>
            <span class="text-lg font-bold" id="app_feedback_thanks" style="display:none">
              Thank you for your feedback!
            </span>
          </div>
          <div
            class="mockup-code mt-4 text-left w-min max-w-[100%] mx-auto"
            id="wired_install"
            style="display:none"
          ></div>
          <div class="mockup-code mt-4 text-left w-min max-w-[100%] mx-auto" id="log" style="display:none"></div>
        </div>
      </div>
    </>
  );
}

export default SignerProgress;
