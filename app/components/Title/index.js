"use client";

const TitleTags = ({ title = "Signtunes" }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <meta itemprop="name" content={title} />
    </>
  );
};

export default TitleTags;
