"use client";
import { getTranslations } from "@/utils/getTranslation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import TitleTags from "../components/Title";
import Head from "next/head";

function ProPurchaseButton({ purchaseButton = <></>, searchParams }) {
  const { referral } = searchParams;

  return (
    <form action="https://api.starfiles.co/payments/purchase" method="POST" className="inline-block">
      <input type="hidden" name="type" value="subscription" />
      <input type="hidden" name="item_name" value="Signtunes 1 Year" />
      <input type="hidden" name="item_number" value="signtunes_1y" />
      <input type="hidden" name="currency_code" value="USD" />

      {/* Set the terms of the regular subscription. */}
      <input type="hidden" name="price" value={process.env.NEXT_PUBLIC_SIGNTUNES_PRICE} />
      <input type="hidden" name="p3" value="1" />
      <input type="hidden" name="t3" value="Y" />

      {/* Params */}
      <input type="hidden" name="device_name" value="Automatically Signed on Purchase" />
      <input
        type="hidden"
        name="request_parameters"
        value='[
            {
                "name":"udid",
                "type":"text",
                "placeholder":"UDID",
                "required":false,
                "text":"A UDID is your device identifier. We need your UDID to get your device registered with Apple.",
                "link":{
                    "text":"Get your UDID",
                    "url":"https:\/\/udid.starfiles.co"
                }
            }
        ]'
      />
      <input type="hidden" name="cancel_return" value="https://signtunes.com" />
      <input type="hidden" name="return" value="https://signtunes.com/success" />

      <input type="hidden" name="platform_name" value="Signtunes" />
      <input type="hidden" name="platform_colour" value="#343a40" />
      <input type="hidden" name="platform_accent" value="#007bff" />
      <input type="hidden" name="platform_background" value="#e9ecef" />

      {(referral || document.referrer) && <input type="hidden" name="referral" value={referral ?? document.referrer} />}
      {purchaseButton}
    </form>
  );
}

function SignerProgress({ searchParams }) {
  const [translationList, setTranslationList] = useState(null);
  const [status, setStatus] = useState("");
  const [statusComponent, setStatusComponent] = useState(
    <p className="text-2xl font-semibold">Sit tight, we are signing your app!</p>
  );
  const [showLog, setShowLog] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [showWired, setShowWired] = useState(false);
  const [showAppFeedback, setShowAppFeedback] = useState(false);
  const [showAppFeedbackReason, setShowAppFeedbackReason] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFeedbackInitial, setShowFeedbackInitial] = useState(true);

  const [log, setLog] = useState(<></>);
  const [progressWidth, setProgressWidth] = useState("0");
  const [wired, setWired] = useState(<></>);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState("");
  // let queryParams = window.location.hash.split("?")[1];
  // let baseUrl = "https://api2.starfiles.co/sign_ipa?stream";
  // let baseUrlB="https://sign-microservice.starfiles.co"
  // // let calledOnce = useRef(false);
  const [queryParams, setQueryParams] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [baseUrlB, setBaseUrlB] = useState("");

  useEffect(() => {
    // Check if the window object is available (client-side only)
    if (typeof window !== "undefined") {
      // Safely access window.location.hash
      const hashQueryParams = window.location.hash.split("?")[1];
      setQueryParams(hashQueryParams);
      // Set base URL (if needed dynamically)
      setBaseUrl("https://api2.starfiles.co/sign_ipa?stream");
      setBaseUrlB("https://sign-microservice.starfiles.co");
    }
  }, []); // Runs only once when the component is mounted

  useEffect(() => {
      // Get Translations
      getTranslationList();
      // Connect Event Source
      connectEventSource();
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

  String.prototype.count = function (c) {
    return this.split(c).length - 1;
  };

  function updateStatusText(text) {
    if (status == text) return;
    setStatus(text);
    setStatusComponent((prev) => (
      <>
        <p className="text-2xl font-semibold max-w-[700px] m-auto px-3 break-words">{text}</p>
        {prev}
      </>
    ));
  }

  function connectEventSource() {
    let eventSource = new EventSource(`https://api2.starfiles.co/sign_ipa?stream&${queryParams}`);
    setShowLog(true);
    eventSource.onmessage = function (event) {
      if (event.data == "Connected") return;
      let data = JSON.parse(event.data.replaceAll("", "").replaceAll("	", ""));
      if (!data.status) {
        setShowProgress(false);
        if (data.message == "Device not registered") {
          updateStatusText(
            <ProPurchaseButton
              searchParams={searchParams}
              purchaseButton={
                <Link
                  className="rounded-md bg-primary hover:bg-[#023E8A] px-2.5 py-2.5 text-lg text-white shadow"
                  href="/purchase"
                >
                  Purchase Signtunes
                </Link>
              }
            />
          );
          setShowLog(false);
        } else updateStatusText("Error: " + data.message);
        eventSource.close();
      } else {
        let output;
        if (data.url !== undefined) output = data.url;
        else output = data.message;
        if (output == "&gt;&gt;&gt;u001b[32m" || output == "&gt;&gt;&gt;u001b[33m") return;
        setProgressWidth(data.progress + "%");
        updateStatusText(output.replaceAll("&gt;&gt;&gt; ", "").replaceAll("u001b[32m", "").replaceAll("u001b[0m", ""));
        console.log("test");
        let formatted_output = output
          .replaceAll("u001b[31m", '<span style="color:red">')
          .replaceAll("u001b[32m", '<span style="color:green">')
          .replaceAll("u001b[33m", '<span style="color:yellow">')
          .replaceAll("u001b[0m", "</span>")
          .replace(/( [A-Za-z ]+:)/, '<span style="color:orange">$1</span>')
          .replaceAll(/([A-Za-z0-9_\.\/]+[./][A-Za-z0-9_]+)/g, `<span style="color:blue">$1</span>`)
          .replaceAll(/(\([a-zA-Z0-9_-]*\))/g, `<span style="color:purple">$1</span>`);
        if (!formatted_output.split("<span").slice(-1)[0].includes("</span")) formatted_output += "</span>";
        let i = formatted_output.count("<span") - formatted_output.count("</span");
        formatted_output += "</span>".repeat(i < 0 ? 0 : i);
        setLog((prev) => (
          <>
            <pre data-prefix=">">
              <code dangerouslySetInnerHTML={{ __html: formatted_output.replace("&gt;&gt;&gt;", "").trim() }} />
            </pre>
            {prev}
          </>
        ));
        if (data.url !== undefined) {
          window.location.href = data.url;
          setWired(
            <>
              <pre data-prefix="#">
                <code>Wired Install</code>
              </pre>
              <pre data-prefix="$">
                <code>{`bash <(curl -s https://signtunes.com/wired_install.sh/${data.url.split("/")[6]}`}</code>
              </pre>
            </>
          );
          setShowWired(true);
          setShowProgress(false);
          updateStatusText("Complete!");
          eventSource.close();
          setShowAppFeedback(true);
          alert(
            "Please reopen this page after app install to give feedback on whether or not the install was successful"
          );
        }
      }
    };
    eventSource.onerror = function (error) {
      updateStatusText("Error: Disconnected from Signer (Retrying)");
      console.error(error);
      setErrors((prev) => prev + " " + error.message);
      eventSource.close();
      setTimeout(connectEventSource, 2000);
    };
  }

  async function app_feedback(working, reason = null) {
    setShowFeedbackInitial(false);
    let ipa;
    let udid;
    window.location.hash
      .split("?")[1]
      .split("&")
      .forEach((str) => {
        split = str.split("=");
        if (split[0] == "ipa") ipa = split[1];
        else if (split[0] == "udid") udid = split[1];
      });
    try {
      if (working) {
        setShowFeedback(true);
        await axios.post(
          "https://api2.starfiles.co/file/" + ipa,
          {
            feedback: true,
            working: true,
            udid,
          }
        );
      } else if (reason == null) {
        setShowAppFeedbackReason(true);
        await axios.post(
          "https://api2.starfiles.co/file/" + ipa,
          {
            feedback: true,
            working: false,
            udid,
          }
        );
      } else {
        setShowAppFeedbackReason(false);
        setShowFeedback(true);
        await axios.post(
          "https://api2.starfiles.co/file/" + ipa,
          {
            feedback: true,
            working: false,
            udid,
            reason,
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      setErrors((prev) => prev + " " + err.message);
    }
  }

  return (
    <>
      <Head>
        <TitleTags title="Signer" />
      </Head>
      <Header searchParams={searchParams} />
      <div className="mx-5 mt-24 mb-12" id="signer-progress">
        <div className="text-center">
          <div className="duration-500" id="status">
            {statusComponent}
          </div>
          {showProgress && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300 mt-4 max-w-[400px] mx-auto">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: progressWidth }} id="progress_bar"></div>
            </div>
          )}
          {showAppFeedback && (
            <div
              className="mt-4 mb-1 px-4 py-2 leading-none rounded-2xl bg-[hsl(var(--n))] dark:bg-gray-800 items-center self-center"
              role="alert"
              id="app_feedback"
            >
              {setShowFeedbackInitial && (
                <div className="flex flex-col" id="app_feedback_initial_prompt">
                  <span className="text-lg font-bold">Is the app working?</span>
                  <p className="text-xs">Feedback helps improve our app suggestion algorithm.</p>
                  <div className="flex justify-center mt-2 gap-4">
                    <button
                      className="flex rounded-full bg-primary hover:bg-secondary uppercase px-8 py-2 text-xs font-bold"
                      id="app_feedback_working"
                      onClick={() => app_feedback(true)}
                    >
                      Yes
                    </button>
                    <button
                      className="flex rounded-full bg-primary hover:bg-secondary uppercase px-8 py-2 text-xs font-bold"
                      id="app_feedback_broken"
                      onClick={() => app_feedback(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
              {showAppFeedbackReason && (
                <div className="flex flex-col gap-2" id="app_feedback_reason">
                  <span className="text-lg font-bold">What is the issue?</span>
                  <div className="flex gap-1 justify-center flex-wrap">
                    <button
                      className="flex rounded-full bg-primary hover:bg-secondary uppercase px-4 py-2 text-xs font-bold"
                      id="app_feedback_crash"
                      onClick={() => app_feedback(false, "crash")}
                    >
                      Crashing
                    </button>
                    <button
                      className="flex rounded-full bg-primary hover:bg-secondary uppercase px-4 py-2 text-xs font-bold"
                      id="app_feedback_integrity"
                      onClick={() => app_feedback(false, "integrity")}
                    >
                      Integrity Error
                    </button>
                    <button
                      className="flex rounded-full bg-primary hover:bg-secondary uppercase px-4 py-2 text-xs font-bold"
                      id="app_feedback_unable"
                      onClick={() => app_feedback(false, "unable")}
                    >
                      Unable to Install
                    </button>
                    <button
                      className="flex rounded-full bg-primary hover:bg-secondary uppercase px-4 py-2 text-xs font-bold"
                      id="app_feedback_other"
                      onClick={() => app_feedback(false, "other")}
                    >
                      Other
                    </button>
                  </div>
                </div>
              )}
              {showFeedback && (
                <span className="text-lg font-bold" id="app_feedback_thanks">
                  Thank you for your feedback!
                </span>
              )}
            </div>
          )}
          {showWired && (
            <div className="mockup-code mt-4 text-left w-min max-w-[100%] mx-auto" id="wired_install">
              {wired}
            </div>
          )}
          {showLog && (
            <div className="mockup-code mt-4 text-left w-min max-w-[100%] mx-auto" id="log">
              {log}
            </div>
          )}
         
          {/* {errors?.trim()?.length > 0 && (
            <button
              onClick={() => setShowError((prev) => !prev)}
              className="rounded-md mt-5 inline-block bg-red-600 hover:bg-red-400 px-2.5 py-2.5 text-lg text-white shadow"
            >
              Show Error
            </button>
          )} */}

          {showError && <code className="p-3 mt-10 inline-block bg-gray-200 rounded-lg mx-[10%]">{errors}</code>}
        </div>
        
      </div>
    </>
  );
}

export default SignerProgress;
