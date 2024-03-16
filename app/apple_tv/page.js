"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AppleTV() {
  const router = useRouter();
  useEffect(() => {
    router.push("/purchase");
  }, []);

  return <div></div>;
}

export default AppleTV;
