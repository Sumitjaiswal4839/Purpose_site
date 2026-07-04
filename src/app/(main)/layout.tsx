import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollHeart from "@/components/ScrollHeart";
import ScrollReveal from "@/components/ScrollReveal";
import Script from "next/script";

// JSON-LD Organization schema for SEO
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Purpose Site",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://purpose.site",
  logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://purpose.site"}/next.svg`,
  description:
    "Create beautiful, personalized digital proposals and heartfelt messages for your loved ones.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@purpose.site",
  },
};

/**
 * Layout for all standard pages — includes Navbar, Footer, ScrollHeart.
 * Editor, Secret, and API routes are excluded from this group.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        strategy="afterInteractive"
      />

      <Navbar />
      <ScrollHeart />
      <ScrollReveal />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
