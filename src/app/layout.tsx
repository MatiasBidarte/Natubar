import type { Metadata } from "next";
import "./globals.css";
import { roboto } from "./ui/fonts";
import ClientLayout from "./ui/root-layout";
import Script from "next/script";
export const metadata: Metadata = {
  title: "Natubar",
  description: "Aplicacion dedicada a la empresa Natubar",
  manifest: "/manifest.json",
  icons: "/icon512_rounded.png",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://sdk.mercadopago.com/js/v2" />
      </head>
      <body className={roboto.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
