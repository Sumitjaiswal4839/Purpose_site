import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeString, sanitizeEmail } from '@/lib/sanitize';
import { sendNotificationEmail } from '../notify/route';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = status !== 'all' ? { status } : {};

    const [requests, total] = await Promise.all([
      prisma.customRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customRequest.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[custom-requests GET]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Sanitize inputs ───────────────────────────────────────────────────
    const rawName = body.customerName || body.name;
    const rawEmail = body.customerEmail || body.email;
    const rawDescription = body.description;
    const rawRequestType = body.requestType;

    if (rawName !== undefined) {
      body.customerName = sanitizeString(rawName, 100);
      body.name = body.customerName;
    }
    if (rawEmail !== undefined) {
      const sanitizedEmail = sanitizeEmail(rawEmail);
      body.customerEmail = sanitizedEmail ?? rawEmail;
      body.email = body.customerEmail;
    }
    if (rawDescription !== undefined) {
      body.description = sanitizeString(rawDescription, 2000);
    }
    if (rawRequestType !== undefined) {
      const allowedTypes = ['order', 'feedback', 'idea'] as const;
      body.requestType = allowedTypes.includes(rawRequestType) ? rawRequestType : 'order';
    }

    // ── Normalise fields from all form sources ────────────────────────────
    // feedback/idea pages send: customerName, customerEmail, description, requestType, rating
    // custom-request page sends: name, email, phone, forWhom, theme, special, urgency, budget
    const customerName: string =
      body.customerName || body.name || 'Anonymous';
    const customerEmail: string =
      body.customerEmail || body.email || 'no-email@provided.com';
    const phoneNumber: string | undefined = body.phoneNumber || body.phone;
    const requestType: string = body.requestType || 'order';
    const rating: number | undefined =
      body.rating != null ? parseInt(String(body.rating)) : undefined;

    // Build description — either direct or from old form fields
    const description: string =
      body.description ||
      [
        body.forWhom ? `For: ${body.forWhom}` : '',
        body.theme ? `Theme: ${body.theme}` : '',
        body.special ? `Special: ${body.special}` : '',
        body.urgency ? `Urgency: ${body.urgency}` : '',
      ]
        .filter(Boolean)
        .join('\n') ||
      'No description provided';

    // Budget — parse string like "₹200 - ₹399" or plain number
    const budget: number | undefined =
      body.budget != null
        ? typeof body.budget === 'number'
          ? body.budget
          : parseFloat(String(body.budget).replace(/[^0-9.]/g, '')) || undefined
        : undefined;

    // Validate minimum required fields
    if (!customerName || customerName === 'Anonymous') {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    // Store extra old-format fields in notes JSON
    const notes =
      body.forWhom || body.theme || body.special || body.urgency
        ? JSON.stringify({
            forWhom: body.forWhom || '',
            theme: body.theme || '',
            special: body.special || '',
            urgency: body.urgency || '',
            originalBudget: body.budget || '',
          })
        : undefined;

    const customRequest = await prisma.customRequest.create({
      data: {
        customerName,
        customerEmail,
        phoneNumber,
        requestType,
        description,
        referenceImages: [],
        budget,
        rating,
        status: 'pending',
        notes,
      },
    });

    // ── Fire admin notify email (non-blocking) ────────────────────────────
    sendNotificationEmail(
      requestType === 'feedback'
        ? {
            type: 'feedback',
            name: customerName,
            email: customerEmail,
            rating: rating ?? 0,
            comment: description,
          }
        : {
            type: 'custom_request',
            name: customerName,
            email: customerEmail,
            phone: phoneNumber,
            description,
            budget: body.budget ? String(body.budget) : undefined,
            urgency: body.urgency,
          }
    ).catch((e) => console.warn('[custom-requests] notify failed:', e));

    return NextResponse.json({
      success: true,
      message: 'Submitted successfully',
      data: { id: customRequest.id },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[custom-requests POST]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
