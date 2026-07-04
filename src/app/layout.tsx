import type { Metadata } from "next";
import "./globals.css";

const inter = { variable: "--font-geist-sans" };
const robotoMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://purpose.site"),
  title: {
    default: "Purpose | Premium Cinematic Proposal Experiences",
    template: "%s | Purpose",
  },
  description:
    "Transform your special moment into a cinematic experience. Create time-limited, password-protected proposal links with music, VFX, and beautiful memories.",
  keywords: ["proposal", "romantic", "engagement", "love", "secret link", "cinematic proposal"],
  openGraph: {
    title: "Purpose | Your Love Story, Cinematized",
    description: "Create a private, interactive proposal experience that lasts a lifetime.",
    url: "https://purpose.site",
    siteName: "Purpose",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Purpose | Premium Cinematic Proposal Experiences",
    description: "The ultimate platform for creating romantic digital memories.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-gray-900 bg-gray-50">
        {children}
      </body>
    </html>
  );
}
