import type { Metadata } from "next";
import "./globals.css";
import { roboto } from "./ui/fonts";
import ClientLayout from "./ui/root-layout";
import Script from "next/script";
export const metadata: Metadata = {
  title: "Natubar",
  description: "Aplicacion dedicada a la empresa Natubar",
  manifest: "/manifest.json",
  keywords:
    "Natubar, e-commerce, compras, pagos, barras naturales, productos saludables, uruguay, entrega domicilio, alimentación sana",
  icons: "icon512_rounded.png",
  openGraph: {
    title: "Natubar - Barras Naturales y Saludables",
    description:
      "Descubre las mejores barras naturales y saludables de Uruguay",
    url: "https://natubar.vercel.app",
    siteName: "Natubar",
    images: [
      {
        url: "https://natubar.vercel.app/icon512_rounded.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className={`${roboto.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
