import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

// TODO: فونت Vazirmatn را داخل src/styles/fonts قرار بده و اینجا با next/font/local لود کن
import localFont from "next/font/local";
const vazir = localFont({
  src: [
    {
      path: "../styles/fonts/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../styles/fonts/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "سامانه مدیریت کلینیک",
  description: "پنل بیمار، پزشک، منشی، مدیر کلینیک و سوپرادمین",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.className} bg-white text-gray-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
