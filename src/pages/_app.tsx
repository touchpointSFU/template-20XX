import "@/styles/globals.css";
import ReactLenis from "lenis/react";
import { AnimatePresence } from "motion/react";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import Script from "next/script";

const univers = localFont({
  src: [
    {
      path: "../fonts/Univers-55.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Univers-55.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-univers",
  display: "swap",
});

const univers_cond = localFont({
  src: [
    {
      path: "../fonts/Univers-57.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Univers-57.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-universCondensed",
  display: "swap",
});

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <div className={`${univers.variable} ${univers_cond.variable} font-sans`}>
      <ReactLenis root />
      <AnimatePresence>
        <Component key={router.route} {...pageProps} />
        <Script src="https://greggman.github.io/webgl-lint/webgl-lint.js" />
      </AnimatePresence>
    </div>
  );
}
