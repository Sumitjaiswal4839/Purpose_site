import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Verify admin token middleware
function verifyAdminAuth(request: NextRequest): boolean {
  const token = request.headers.get('x-admin-token');
  const adminToken = Buffer.from(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).toString('base64');
  return token === adminToken;
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, string> = {};
    if (status === 'pending') {
      filter.paymentStatus = 'pending';
    } else if (status === 'verified') {
      filter.paymentStatus = 'verified';
    } else if (status === 'failed') {
      filter.paymentStatus = 'failed';
    }

    // Get proposals
    const proposals = await prisma.secretLink.findMany({
      where: filter,
      select: {
        id: true,
        token: true,
        transactionId: true,
        yourName: true,
        partnerName: true,
        customerEmail: true,
        paymentStatus: true,
        paymentAmount: true,
        maxViews: true,
        currentViews: true,
        isActive: true,
        expiresAt: true,
        verifiedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Get total count
    const total = await prisma.secretLink.count({ where: filter });

    // Get statistics
    const stats = {
      totalProposals: await prisma.secretLink.count(),
      pendingVerification: await prisma.secretLink.count({ where: { paymentStatus: 'pending' } }),
      verifiedProposals: await prisma.secretLink.count({ where: { paymentStatus: 'verified' } }),
      totalRevenue: await prisma.secretLink.aggregate({
        where: { paymentStatus: 'verified' },
        _sum: { paymentAmount: true },
      }),
    };

    return NextResponse.json({
      success: true,
      data: proposals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Admin fetch proposals error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Verify a proposal manually
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId } = body;

    const proposal = await prisma.secretLink.update({
      where: { transactionId },
      data: {
        isActive: true,
        paymentStatus: 'verified',
        verifiedAt: new Date(),
        verifiedBy: 'manual-admin',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Proposal verified successfully',
      data: proposal,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
