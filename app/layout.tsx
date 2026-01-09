import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Nepal Bhumi Bank Limited",
    template: "%s | Nepal Bhumi Bank Limited",
  },
  description: "Nepal Bhumi Bank Limited - Your trusted banking partner. Offering comprehensive banking services, digital solutions, and financial products to help you achieve your financial goals.",
  keywords: [
    "Nepal Bhumi Bank",
    "Banking",
    "Financial Services",
    "Nepal Bank",
    "Digital Banking",
    "Online Banking",
    "Banking Solutions",
  ],
  authors: [{ name: "Nepal Bhumi Bank Limited" }],
  creator: "Nepal Bhumi Bank Limited",
  publisher: "Nepal Bhumi Bank Limited",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Nepal Bhumi Bank Limited",
    title: "Nepal Bhumi Bank Limited",
    description: "Your trusted banking partner offering comprehensive banking services and digital solutions.",
  },
  twitter: {
    card: "summary_large_image",
  title: "Nepal Bhumi Bank Limited",
    description: "Your trusted banking partner offering comprehensive banking services and digital solutions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
