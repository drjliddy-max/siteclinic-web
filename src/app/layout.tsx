import type { Metadata } from "next";
import { DM_Serif_Display, Geist } from "next/font/google";
import "./globals.css";

/*
 * Fonts loaded via next/font/google — self-hosted at build time, no FOIT,
 * no external CDN dependency, no preconnect needed (same-origin).
 *
 * DM Serif Display: 400 + 400 italic. Italic is required for hero <em>
 * accent lines; without it, the browser synthesizes fake italic and the
 * headline reads broken at display sizes.
 *
 * Geist: 400, 500, 600. Three weights actually used (body 400, button
 * labels and headings 500, occasional emphasis 600). Loading more is
 * wasted bandwidth.
 */
const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  display: "swap",
});

const geist = Geist({
  weight: ["400", "500", "600"],
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://siteclinic.io"),
  title: "Site Clinic — Visibility management for small-business websites",
  description:
    "Monitor website accessibility, performance, SEO & security. Site Clinic guides small businesses with nightly scans & proof of improvements. From $49/month.",
  alternates: { canonical: "https://siteclinic.io" },
  icons: {
    icon: [{ url: "/site-clinic-mark-128.png", type: "image/png", sizes: "128x128" }],
    apple: "/site-clinic-mark-128.png",
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://siteclinic.io",
    siteName: "Site Clinic",
    title: "Site Clinic — Visibility management for small-business websites",
    description:
      "Monitor website accessibility, performance, SEO & security. Site Clinic guides small businesses with nightly scans & proof of improvements. From $49/month.",
    images: [
      {
        url: "https://siteclinic.io/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Site Clinic visibility management for small-business websites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Site Clinic — Visibility management for small-business websites",
    description:
      "Monitor website accessibility, performance, SEO & security. Site Clinic guides small businesses with nightly scans & proof of improvements. From $49/month.",
    images: ["https://siteclinic.io/opengraph-image"],
  },
};

/*
 * Brand-level JSON-LD structured data — applies to every page.
 *
 * Per-page schemas (SoftwareApplication on /, FAQPage on /pricing FAQ
 * block, etc.) get added to individual page.tsx files during §5b.
 *
 * Sourced from docs/site-truth/SOURCE_OF_TRUTH.md — every claim here
 * is repo-confirmed or operator-verified, no fabricated facts.
 */
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://siteclinic.io/#org",
  name: "Site Clinic",
  url: "https://siteclinic.io",
  logo: "https://siteclinic.io/site-clinic-mark-128.png",
  email: "hello@siteclinic.io",
  founder: {
    "@type": "Person",
    name: "John Liddy",
    jobTitle: "Founder",
  },
  sameAs: [
    "https://adaauditreport.com/",
    "https://www.theparticipationeffect.com/",
    "https://daily-rise.com/",
  ],
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://siteclinic.io/#website",
  url: "https://siteclinic.io",
  name: "Site Clinic",
  publisher: { "@id": "https://siteclinic.io/#org" },
  inLanguage: "en-US",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <div id="main-content" tabIndex={-1} className="min-h-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
