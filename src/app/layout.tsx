import type { Metadata, Viewport } from "next";
import "./globals.css";
import { appConfig } from "@/lib/config/app-config";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${appConfig.name} | Cloud UAE E-Invoicing & VAT Compliance SaaS`,
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
    <html lang="en" dir="ltr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full font-sans antialiased text-slate-900 bg-slate-50 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
