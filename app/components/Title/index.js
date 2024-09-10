"use client";

import Head from "next/head";

const TitleTags = ({ title = "Signtunes" }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <meta itemProp="name" content={title} />
    </Head>
  );
};

export default TitleTags;
