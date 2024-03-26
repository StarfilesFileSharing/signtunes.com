"use client";
import { getTranslations } from "@/utils/getTranslation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TitleTags from "../components/Title";

function DeviceStatus() {
  const [translationList, setTranslationList] = useState(null);
  const [udid, setUdid] = useState("");
  const router = useRouter();
  const [output, setOutput] = useState("");
  const [hideButton, setHideButton] = useState(false);

  useEffect(() => {
    // Get Translations
    getTranslationList();
    // Check Cookie
    checkCookie();
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
  const checkCookie = () => {
    if (document.cookie.indexOf("udid=") != -1) router.push("/settings");
  };

  // On Check
  const onCheck = async () => {
    try {
      if (!udid.match(/^([a-fA-F0-9]{40}|[0-9]{8}-[a-fA-F0-9]{16})$/)) {
        setOutput("Invalid UDID");
        return false;
      }
      const d = new Date();
      d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
      document.cookie = "udid=" + udid + ";expires=" + d.toUTCString() + ";path=/;domain=.signtunes.com";
      setOutput("Checking Status");
      const response = await axios.get(
        "https://api.starfiles.co/device_enrolments/check_enrolment?organisation=2&udid=" + udid
      );
      const data = response.data;

      if (!data.developer_account) router.push("/purchase");

      let signed_days_ago = (Math.floor(Date.now() / 1000) - data.signed_time) / 60 / 60 / 24;

      let eligible_in;

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

      let finalOutput = (
        <>
          <p style="margin-top:24px">
            Plan Expires in ` + Math.floor((data.signed_till-Math.floor(Date.now()/1000))/60/60/24) + ` Days
          </p>
          <p>Account ID: ` + data.developer_account + `</p>
        </>
      );

      let outputFirst = <></>;
      if (data.registered)
        outputFirst = (
          <div className="step">
            <div className="node green"></div>
            <div className="state">
              <p>Registered</p>
              <p className="timeframe"></p>
            </div>
          </div>
        );
      else
        outputFirst = (
          <div className="step">
            <div className="node red"></div>
            <div className="state">
              <p>Registered</p>
              <p className="timeframe">Signtunes not Purchased</p>
            </div>
          </div>
        );
      let outputSecond = <></>;
      if (data.enrolled)
        outputSecond = (
          <>
            <div className="divider green"></div>
            <div className="step">
              <div className="node green"></div>
              <div className="state">
                <p>Enrolled</p>
                <p className="timeframe"></p>
              </div>
            </div>
            ;
          </>
        );
      else
        outputSecond = (
          <>
            <div className="divider"></div>
            <div className="step">
              <div className="node"></div>
              <div className="state">
                <p>Enrolled</p>
                <p className="timeframe">Create a Support Ticket</p>
              </div>
            </div>
            ;
          </>
        );
      let outputThree = <></>;
      if (data.processed)
        outputThree = (
          <>
            <div className="divider green"></div>
            <div className="step">
              <div className="node green"></div>
              <div className="state">
                <p>Processed</p>
                <p className="timeframe"></p>
              </div>
            </div>
          </>
        );
      else
        outputThree = (
          <>
            <div className="divider"></div>
            <div className="step">
              <div className="node"></div>
              <div className="state">
                <p>Processed</p>
                <p className="timeframe">
                  Maximum Processing Time:{" "}
                  {data.signed_time === "null"
                    ? "72"
                    : Math.round((Math.floor(Date.now() / 1000) - data.signed_time) / 60 / 60)}{" "}
                  Hours
                </p>
              </div>
            </div>
          </>
        );
      let outputFour = <></>;
      if (data.eligible)
        outputFour = (
          <>
            <div className="divider green"></div>
            <div className="step">
              <div className="node green"></div>
              <div className="state">
                <p>Eligible</p>
                <p className="timeframe"></p>
              </div>
            </div>
          </>
        );
      else
        outputFour = (
          <>
            <div className="divider"></div>
            <div className="step">
              <div className="node"></div>
              <div className="state">
                <p>Eligible</p>
                <p className="timeframe">
                  {data.processed ? "Eligible in Maximum " + eligible_in + " Days" : "Eligible in 0, 7, 14, or 30 Days"}
                </p>
              </div>
            </div>
            ;
          </>
        );
      let outputFive = <></>;
      if (data.signed)
        outputFive = (
          <>
            <div className="divider green"></div>
            <div className="step">
              <div className="node green"></div>
              <div className="state">
                <p>Signed</p>
                <p className="timeframe"></p>
              </div>
            </div>
          </>
        );
      else
        outputFive = (
          <>
            <div className="divider"></div>
            <div className="step">
              <div className="node"></div>
              <div className="state">
                <p>Signed</p>
                <p className="timeframe">Estimated Processing Time: 30 Seconds</p>
              </div>
            </div>
          </>
        );
      if (data.revoked) setOutput(<>Apple has revoked your device. Sign an app to get re-signed.{finalOutput}</>);
      else {
        setOutput(
          <>
            {outputFirst}
            {outputSecond}
            {outputThree}
            {outputFour}
            {outputFive}
            {finalOutput}
          </>
        );
      }
      setHideButton(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <head>
        <TitleTags title="Device Status" />
      </head>
      <div className="mx-5 md:mx-10 mt-5" id="device_status">
        <div className="lg:mx-96 mb-8 flex items-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-28 w-28">
            <path d="M80 0C44.7 0 16 28.7 16 64V448c0 35.3 28.7 64 64 64H304c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H80zm80 432h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H160c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path>
          </svg>
          <div>
            <p className="text-2xl font-bold">Device Status</p>
            <span>Check Device Enrolment</span>
          </div>
        </div>
        <div className="lg:mx-96 mb-12 block rounded-xl p-8 shadow-xl text-center bg-bright dark:text-gray-900">
          <h3 className="text-xl font-semibold dark:text-black">Enter your UDID</h3>
          <div className="my-6">
            <input
              type="udid"
              name="udid"
              id="udid"
              placeholder="UDID"
              autocomplete="username"
              value={udid}
              onChange={(e) => setUdid(e.target.value)}
              className="block w-full p-2 text-gray-900 rounded-lg bg-gray-50 sm:text-md"
              required
            />
          </div>
          {!hideButton && (
            <button
              type="button"
              className="mt-2 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 mb-1"
              id="checkStatusBtn"
              onClick={onCheck}
            >
              Check
            </button>
          )}
          <div className="text-left" id="output">
            {output}
          </div>
        </div>
        <p>
          <b>Q: Why is my device on hold with Signtunes?</b>
          <br />
          A: Apple might put a hold on your device for a short period of time, preventing it from installing any apps
          via Signtunes until the hold is lifted. This is out of our control and is done by Apple, not Signtunes.
          <br />
          <br />
          <b>Q: How long will my device be on hold for?</b>
          <br />
          A: The hold duration is decided by Apple and varies. The hold usually goes through two stages, an initial hold
          of 0-72 hours, and a final hold of 0, 7, 14, or 30 days. We cannot provide an exact timeframe as we are
          restricted by Apple.
          <br />
          <br />
          <b>Q: Will signing on multiple services increase the chances of device holds?</b>
          <br />
          A: Yes, it can and it is out of our control and decided by Apple.
          <br />
          <br />
          <b>Q: Is there anything I can do to prevent device holds?</b>
          <br />
          A: Unfortunately, there is nothing that can be done to prevent it as it is based on various factors such as
          device history, apps installed, developer accounts used in the past, and many other factors.
          <br />
          <br />
          <b>Q: Will my sign time be extended if my device is placed on hold?</b>
          <br />
          A: Yes, we extend sign time if a user's device is placed on hold. This is done automatically by the system.
        </p>
      </div>
    </>
  );
}

export default DeviceStatus;
