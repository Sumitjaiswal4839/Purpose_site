import { Metadata, ResolvingMetadata } from "next";
import { prisma } from "@/lib/prisma";
import SecretClientPage from "./SecretClientPage";

type Props = {
  params: { token: string };
};

/**
 * Fixes applied:
 * - Issue #19: We no longer pass proposalData directly from SSR to the client.
 *   Previously this bypassed the view counter in /api/links/verify — a user could
 *   see the full proposal without consuming a view.
 *   Now proposalData is always null. The client calls /api/links/verify on mount,
 *   which enforces payment check, view counting, and expiry.
 *
 * - Metadata is still fetched server-side for SEO (og:image, title, description)
 *   but the actual proposal content is gated client-side via verifyToken().
 */

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const token = params.token;

  // Fetch only the minimal fields needed for metadata — NOT the full payload
  const proposal = await prisma.secretLink.findUnique({
    where: { token },
    select: {
      partnerName: true,
      yourName: true,
      mediaUrls: true,
      paymentStatus: true,
      isActive: true,
    },
  });

  if (!proposal || proposal.paymentStatus !== "verified" || !proposal.isActive) {
    return {
      title: "Secret Memory | Purpose",
      description: "A private cinematic experience.",
    };
  }

  return {
    title: `A Secret for ${proposal.partnerName} 🏹`,
    description: `Sent with love by ${proposal.yourName}. Open to reveal a special cinematic surprise.`,
    openGraph: {
      title: `Hi ${proposal.partnerName}, I have something to tell you... 💘`,
      description: `A private cinematic experience created by ${proposal.yourName} just for you.`,
      images:
        Array.isArray(proposal.mediaUrls) && proposal.mediaUrls.length > 0
          ? [String(proposal.mediaUrls[0])]
          : ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `A Surprise for ${proposal.partnerName}`,
      description: "Open the link to reveal your secret memory.",
      images:
        Array.isArray(proposal.mediaUrls) && proposal.mediaUrls.length > 0
          ? [String(proposal.mediaUrls[0])]
          : ["/og-image.png"],
    },
  };
}

export default function Page({ params }: Props) {
  /**
   * Always pass proposalData=null so SecretClientPage always calls
   * /api/links/verify on mount. This enforces:
   *   1. Payment gate check
   *   2. View counter increment
   *   3. Expiry check
   */
  return <SecretClientPage proposalData={null} token={params.token} />;
}
