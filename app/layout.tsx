import type { Metadata, Viewport } from "next";
import { Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const TITLE = "UK Visa Sponsor Checker — Is a Company a Licensed Sponsor?";

export const metadata: Metadata = {
  // Lets all URL-based metadata fields below use relative paths.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Child routes render as "<page> · UK Visa Sponsor Checker".
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "UK sponsor licence",
    "visa sponsorship",
    "licensed sponsor checker",
    "Skilled Worker visa",
    "UKVI register of sponsors",
    "company sponsor licence",
  ],
  authors: [{ name: SITE_NAME }],
  // Search/query-string variants all canonicalise to the home page.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  // The site has a single fixed vivid-orange theme (see globals.css).
  colorScheme: "light",
  themeColor: "#f9521e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
