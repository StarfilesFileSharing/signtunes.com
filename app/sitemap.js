export default function sitemap() {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
  return [
    {
      url,
      lastModified: new Date(),
    },
    {
      url: `${url}/app`,
      lastModified: new Date(),
    },
    {
      url: `${url}/appdb_plus`,
      lastModified: new Date(),
    },
    {
      url: `${url}/apple_tv`,
      lastModified: new Date(),
    },
    {
      url: `${url}/claim`,
      lastModified: new Date(),
    },
    {
      url: `${url}/components`,
      lastModified: new Date(),
    },
    {
      url: `${url}/device_status`,
      lastModified: new Date(),
    },
    {
      url: `${url}/express`,
      lastModified: new Date(),
    },
    {
      url: `${url}/faq`,
      lastModified: new Date(),
    },
    {
      url: `${url}/mac`,
      lastModified: new Date(),
    },
    {
      url: `${url}/pro`,
      lastModified: new Date(),
    },
    {
      url: `${url}/purchase`,
      lastModified: new Date(),
    },
    {
      url: `${url}/search`,
      lastModified: new Date(),
    },
    {
      url: `${url}/settings`,
      lastModified: new Date(),
    },
    {
      url: `${url}/signer`,
      lastModified: new Date(),
    },
    {
      url: `${url}/signer-progress`,
      lastModified: new Date(),
    },
    {
      url: `${url}/success`,
      lastModified: new Date(),
    },
    {
      url: `${url}/vip`,
      lastModified: new Date(),
    },
  ];
}
