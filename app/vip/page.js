"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function VIP() {
  const router = useRouter();
  useEffect(() => {
    router.push("/pro");
  }, []);

  return <div></div>;
}

export default VIP;
