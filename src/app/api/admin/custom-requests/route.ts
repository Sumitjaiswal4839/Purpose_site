import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

function verifyAdminAuth(req: NextRequest): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const token = req.headers.get('x-admin-token');
  if (token && adminUsername) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      if (decoded.startsWith(adminUsername)) return true;
    } catch {
      // invalid base64
    }
  }
  return false;
}

export async function GET(req: NextRequest) {
  try {
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const dbRequests = await prisma.customRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Map to the shape the admin dashboard frontend expects
    const requests = dbRequests.map((r) => {
      // Try to parse extra fields stored in notes JSON
      let extra: Record<string, string> = {
        forWhom: '', theme: '', special: '', urgency: '', originalBudget: '',
      };
      if (r.notes) {
        try {
          extra = { ...extra, ...JSON.parse(r.notes) };
        } catch {
          // notes not JSON — parse from description lines
          r.description.split('\n').forEach((line) => {
            if (line.startsWith('For: '))     extra.forWhom = line.slice(5);
            if (line.startsWith('Theme: '))   extra.theme   = line.slice(7);
            if (line.startsWith('Special: ')) extra.special = line.slice(9);
            if (line.startsWith('Urgency: ')) extra.urgency = line.slice(9);
          });
        }
      }

      return {
        id:          r.id,
        createdAt:   r.createdAt,
        name:        r.customerName,
        email:       r.customerEmail,
        phone:       r.phoneNumber ?? '',
        requestType: r.requestType,
        rating:      r.rating ?? 0,
        description: r.description,
        forWhom:     extra.forWhom,
        theme:       extra.theme,
        special:     extra.special,
        urgency:     extra.urgency,
        budget:      extra.originalBudget || (r.budget ? `₹${r.budget}` : ''),
        status:      r.status === 'completed' ? 'completed' : 'pending',
      };
    });

    return NextResponse.json({ success: true, requests });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[admin/custom-requests GET]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status required' }, { status: 400 });
    }

    await prisma.customRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[admin/custom-requests PATCH]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
