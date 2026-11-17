import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import { Grain } from "@/components/layout/Grain";
import { ClientEffects } from "@/components/layout/ClientEffects";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { TechSprite } from "@/components/ui/TechIcon";
import { profile, SITE_URL } from "@/data/profile";
import { knowsAbout } from "@/data/skills";
import { motionBootScript } from "@/lib/env";
import "./globals.css";

const clash = localFont({
  src: [
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
  fallback: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const title = `${profile.name} — ${profile.title} (React, Next.js, Node.js)`;
const description =
  "Senior Full-Stack Developer with 4+ years building multi-tenant ERP platforms, SaaS products, mobile apps, real-time systems and live brand websites with React, Next.js, Node.js, NestJS, PostgreSQL and React Native.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s — ${profile.name}` },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "Senior Full-Stack Developer",
    "React developer",
    "Next.js developer",
    "Node.js",
    "NestJS",
    "PostgreSQL",
    "React Native",
    "TypeScript",
    profile.name,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: profile.name,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: SITE_URL,
  image: `${SITE_URL}${profile.photo.src}`,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Malappuram",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  sameAs: [profile.linkedin, profile.github],
  knowsAbout,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${clash.variable} ${inter.variable} ${geistMono.variable}`}
      data-motion="full"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <TechSprite />
        <Providers>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Nav />
          <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
            {children}
          </main>
          <Footer />
          <Grain />
          <ClientEffects />
        </Providers>
      </body>
    </html>
  );
}
