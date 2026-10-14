import type { Metadata, Viewport } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { appConfig } from "@/lib/config/app-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${appConfig.name} | UAE E-Invoicing & VAT Compliance SaaS`,
  description: appConfig.description,
  keywords: [
    "UAE E-Invoicing",
    "Peppol PINT AE",
    "UAE VAT",
    "Federal Tax Authority",
    "FTA TRN",
    "Dubai E-Invoicing SaaS",
    "Abu Dhabi Invoicing",
    "Accredited Service Provider ASP",
  ],
  authors: [{ name: appConfig.name }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${cairo.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="h-full font-sans antialiased text-slate-900 bg-slate-50 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
