"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AppDB() {
  const router = useRouter();
  useEffect(() => {
    router.push("/purchase");
  }, []);

  return <div></div>;
}

export default AppDB;
