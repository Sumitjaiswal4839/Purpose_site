import { Metadata, ResolvingMetadata } from 'next';
import { prisma } from '@/lib/prisma';
import SecretClientPage from './SecretClientPage';
import { notFound } from 'next/navigation';

type Props = {
  params: { token: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const token = params.token;

  // Fetch proposal for metadata
  const proposal = await prisma.secretLink.findUnique({
    where: { token },
  });

  if (!proposal) {
    return {
      title: 'Secret Memory | Purpose',
    };
  }

  return {
    title: `A Secret for ${proposal.partnerName} 🏹`,
    description: `Sent with love by ${proposal.yourName}. Open to reveal a special cinematic surprise.`,
    openGraph: {
      title: `Hi ${proposal.partnerName}, I have something to tell you... 💘`,
      description: `A private cinematic experience created by ${proposal.yourName} just for you.`,
      images: Array.isArray(proposal.mediaUrls) && proposal.mediaUrls.length > 0 ? [String(proposal.mediaUrls[0])] : ['/api/og-fallback'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `A Surprise for ${proposal.partnerName}`,
      description: `Open the link to reveal your secret memory.`,
      images: Array.isArray(proposal.mediaUrls) && proposal.mediaUrls.length > 0 ? [String(proposal.mediaUrls[0])] : ['/api/og-fallback'],
    },
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  };
}

export default async function Page({ params }: Props) {
  const token = params.token;

  // Fetch initial data for SSR
  const proposal = await prisma.secretLink.findUnique({
    where: { token },
  });

  // Even if not found or inactive, we pass the token to SecretClientPage 
  // which will handle the "Not Found" or "Inactive" UI with the correct reason.
  return <SecretClientPage proposalData={JSON.parse(JSON.stringify(proposal))} token={token} />;
}
