import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজার দর, দামের তুলনা ও বিশ্লেষণ এক নজরে দেখুন। চাল, ডাল, তেল, সবজি, মাছ, মাংস সবকিছুর আজকের দাম।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: "Hind Siliguri, sans-serif",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
