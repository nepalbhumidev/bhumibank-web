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
    default: "Nepal Bhumi Bank Limited | Transforming Barren Land into Productive Assets",
    template: "%s | Nepal Bhumi Bank Limited",
  },
  description:
    "Nepal Bhumi Bank Limited is pioneering land pooling and modern agricultural management in Nepal. We secure land ownership, convert barren land into productive farms, empower youth agripreneurs, and promote market-led agriculture for national food security.",
  keywords: [
    "Nepal Bhumi Bank",
    "Land Bank Nepal",
    "Land Pooling Nepal",
    "Agricultural Transformation Nepal",
    "Barren Land Utilization",
    "Modern Farming Nepal",
    "Agri Entrepreneurship",
    "Market Led Agriculture",
    "Youth in Agriculture Nepal",
    "Food Security Nepal",
  ],
  authors: [{ name: "Nepal Bhumi Bank Limited" }],
  creator: "Nepal Bhumi Bank Limited",
  publisher: "Nepal Bhumi Bank Limited",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Nepal Bhumi Bank Limited",
    title: "Nepal Bhumi Bank Limited | Nepal’s First Land Bank Initiative",
    description:
      "Nepal’s first land bank initiative securing land ownership while enabling large-scale, technology-driven, and market-oriented agriculture across the country.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepal Bhumi Bank Limited | Land Banking for Agricultural Growth",
    description:
      "Transforming unused land into productive agricultural assets through land pooling, technology, and market-led farming in Nepal.",
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
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
