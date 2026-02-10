import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Nepal Bhumi Bank Limited | Transforming Barren Land into Productive Assets",
    template: "%s | Nepal Bhumi Bank Limited",
  },
  description:
    "Nepal Bhumi Bank Limited is pioneering land pooling and modern land investment management in Nepal. We secure land ownership, convert barren land into productive investments, empower youth agripreneurs, and promote market-led investments for national economic growth.",
  keywords: [
    "Nepal Bhumi Bank",
    "Land Bank Nepal",
    "Land Pooling Nepal",
    "Land Investment Transformation Nepal",
    "Barren Land Utilization",
    "Food Security Nepal",
    "Bhumi Bank",
    "Rastriya Bhumi Bank",
    "Rastriya Bhumi Bank Limited",
    "Rastriya Bhumi Bank Limited Nepal",
    "Bhumi",
  ],
  authors: [{ name: "Nepal Bhumi Bank Limited" }],
  creator: "Nepal Bhumi Bank Limited",
  publisher: "Nepal Bhumi Bank Limited",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  icons: {
    icon: "/nbb-logo.png",
    shortcut: "/nbb-logo.png",
    apple: "/nbb-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Nepal Bhumi Bank Limited",
    title: "Nepal Bhumi Bank Limited | Nepal’s First Land Bank Initiative",
    description:
      "Nepal’s first land bank initiative securing land ownership while enabling large-scale, technology-driven, and market-oriented investments in the country.",
    images: [
      {
        url: "/nbb-logo.png",
        width: 1200,
        height: 630,
        alt: "Nepal Bhumi Bank Limited",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepal Bhumi Bank Limited | Land Banking for Investment Growth",
    description:
      "Transforming unused land into productive investment assets through land pooling, technology, and market-led investments in Nepal.",
    images: ["/nbb-logo.png"],
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M4HLJMP3R9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M4HLJMP3R9');
          `}
        </Script>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
