"use client";
import { usePathname } from "@/node_modules/next/navigation";

const CanonicalTag = () => {
  const pathname = usePathname();
  const canonicalUrl = (process.env.NEXT_PUBLIC_WEBSITE_URL + (pathname === "/" ? "" : pathname)).split("?")[0];
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:url" content={canonicalUrl} />
    </>
  );
};

export default CanonicalTag;
