import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "./ui/fonts";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ClientLayout from "./ui/root-layout";

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
      <body className={`${montserrat.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
