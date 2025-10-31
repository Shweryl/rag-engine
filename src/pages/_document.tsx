import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="night">
      <Head />
      <body className="antialiased min-h-screen"
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
