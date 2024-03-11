import { Inter } from "next/font/google";
import Script from "next/script";
import CanonicalTag from "./components/Canonical";
import TitleTags from "./components/Title";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Title */}
        <TitleTags />
        <meta property="og:site_name" content="Signtunes" />
        <meta name="application-name" content="Signtunes" />
        <meta name="apple-mobile-web-app-title" content="Signtunes" />
        <meta name="twitter:domain" content="Signtunes" />

        {/* Description */}
        <meta property="og:description" content="The #1 Signing Service for iPhone, iPad, Mac, and Apple TV" />
        <meta name="description" content="The #1 Signing Service for iPhone, iPad, Mac, and Apple TV" />
        <meta name="twitter:description" content="The #1 Signing Service for iPhone, iPad, Mac, and Apple TV" />
        <meta name="abstract" content="The #1 Signing Service for iPhone, iPad, Mac, and Apple TV" />
        <meta itemprop="description" content="The #1 Signing Service for iPhone, iPad, Mac, and Apple TV" />

        {/* Fetch DNS Async */}
        <link rel="preconnect" href="https://api.starfiles.co" />
        <link rel="preconnect" href="https://cdn.starfiles.co" />
        <link rel="preconnect" href="https://sts.st" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://raw.githubusercontent.com" />

        {/* Fetch DNS files when Idle */}
        <link rel="dns-prefetch" href="https://api.starfiles.co" />
        <link rel="dns-prefetch" href="https://cdn.starfiles.co" />
        <link rel="dns-prefetch" href="https://sts.st" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />

        {/* Icon */}
        <link rel="shortcut icon" href="https://starfiles.co/favicon.ico" type="image/x-icon" />
        <link
          rel="shortcut icon"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo.svg"
          type="image/svg+xml"
        />
        <link
          rel="mask-icon"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo.svg"
          color="#5bbad5"
        />
        <meta
          property="og:image"
          content="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-256.png"
        />
        <meta
          property="og:image:url"
          content="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-256.png"
        />
        <meta
          property="og:image:secure_url"
          content="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-256.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="256" />
        <meta property="og:image:height" content="256" />
        <meta property="og:image:alt" content="The Starfiles logo (a star)." />
        <meta
          itemprop="image"
          content="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-128.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-512.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-256.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-128.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="64x64"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-64.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-32.png"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo.svg"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-512.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="256x256"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-256.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="128x128"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-128.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="64x64"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-64.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="32x32"
          href="//cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-32.png"
        />

        <meta property="og:image:type" content="image/png" />
        {/* Author */}
        <meta name="og:email" content="3parsa3@gmail.com" />
        <meta name="twitter:creator" content="@Quix_Tweets" />
        <meta name="twitter:site" content="@StarfilesHelp" />
        <meta name="author" content="Parsa Yazdani (Quix), 3parsa3@gmail.com" />
        <link rel="author" href="https://starfiles.co/humans.txt" />

        {/* PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* <link rel="manifest" href="https://starfiles.co/manifest.webmanifest"> */}

        {/* Languages */}
        <meta property="og:locale" content="en" />
        <meta name="language" content="en" />

        {/* Links */}
        <CanonicalTag />
        <meta property="og:see_also" content="https://signtunes.com" />
        <meta property="og:see_also" content="https://signtunes.com/faq" />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Public Files"
          href="https://api.starfiles.co/public.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Public Files"
          href="https://api.starfiles.co/public.xml"
        />

        {/* meta */}
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="keywords" content="signtunes, ios, sideload, sideloading, jailbreak, ipa" />
        <meta name="rating" content="general" />
        <meta name="theme-color" content="#111827" />

        {/* Schema */}
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Signtunes",
                description: "Signtunes -The #1 Signing Service for iPhone, iPad, Mac, and Apple TV",
                image: "https://cdn.jsdelivr.net/gh/QuixThe2nd/Starfiles-JSDelivr@latest/images/logo-256.png",
                url: "https://<?php echo $domain;?>",
                author: {
                  "@type": "Person",
                  name: "Parsa Yazdani",
                },
                sameAs: ["https://twitter.com/StarfilesHelp"],
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://<?php echo $domain;?>/search?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              null,
              "\t"
            ),
          }}
        />

        <link
          href="https://cdn.jsdelivr.net/combine/npm/flowbite@1/dist/flowbite.min.css,npm/daisyui@2/dist/full.css"
          rel="stylesheet"
        />

        <Script
          async
          defer
          src="https://cdn.jsdelivr.net/combine/npm/flowbite@1/dist/flowbite.min.js,npm/@fortawesome/fontawesome-free@6/js/all.min.js"
          data-cfasync="false"
        />

        {/*Cloudflare Web Analytics*/}
        <Script
          async
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "a332772e3df145f6854de4acecedbf8c"}'
        />
        {/*Microsoft Clarity*/}
        <Script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "d1rjxkvlxd");`,
          }}
        />
        {/*Google tag (gtag.js)*/}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-EFD6HMSKRC" />
        <Script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-EFD6HMSKRC');`,
          }}
        />

        <Script
          dangerouslySetInnerHTML={{
            __html: `
        if(localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))
            document.documentElement.classList.add('dark');
        else
            document.documentElement.classList.remove('dark');`,
          }}
        />
      </head>
      <body className={inter.className + " dark:bg-gray-700 dark:text-gray-200 bg-white text-black"}>{children}</body>
    </html>
  );
}
