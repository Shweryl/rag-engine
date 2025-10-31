import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <SessionProvider>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  </>;
}
