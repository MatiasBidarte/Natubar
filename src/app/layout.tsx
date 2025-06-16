import type { Metadata } from "next";
import "./globals.css";
import { roboto } from "./ui/fonts";
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
      <body className={`${roboto.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
