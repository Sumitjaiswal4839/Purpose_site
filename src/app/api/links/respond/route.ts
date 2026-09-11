import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON format in request body' }, { status: 400 });
    }
    const { token, response } = body ?? {};

    if (!token || !response) {
      return NextResponse.json({ error: 'Token and response are required' }, { status: 400 });
    }

    // Find the link
    const secretLink = await prisma.secretLink.findUnique({
      where: { token },
    });

    if (!secretLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Update the response in the database
    await prisma.secretLink.update({
      where: { id: secretLink.id },
      data: {
        partnerResponse: response,
        respondedAt: new Date(),
      } as any,
    });

    // Send email notification to the sender
    if (secretLink.userEmail) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Purpose" <${process.env.GMAIL_USER}>`,
        to: secretLink.userEmail,
        subject: `🎉 Great news! ${secretLink.partnerName} said YES!`,
        html: `
          <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #fdf2f8;">
            <h1 style="color: #be185d;">They said YES! 💍</h1>
            <p style="font-size: 18px; color: #475569; margin-top: 20px;">
              Your partner <strong>${secretLink.partnerName}</strong> just opened your proposal and clicked YES!
            </p>
            <p style="font-size: 16px; color: #64748b; margin-top: 40px;">
              Congratulations from the Purpose Team! 💘
            </p>
          </div>
        `,
      };

      // We send it asynchronously so we don't block the API response
      transporter.sendMail(mailOptions).catch((err: any) => {
        console.error('Failed to send notification email:', err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
