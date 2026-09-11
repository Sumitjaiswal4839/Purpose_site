import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a secure JWT that expires in 15 minutes
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'fallback-secret-for-dev', { expiresIn: '15m' });
    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Purpose" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Your Purpose Dashboard Login Link 💌`,
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #f8fafc;">
          <h1 style="color: #0f172a;">Purpose Dashboard</h1>
          <p style="font-size: 16px; color: #475569; margin-top: 20px;">
            Click the button below to securely log into your Purpose dashboard and manage your proposals.
          </p>
          <a href="${magicLink}" style="display: inline-block; margin-top: 30px; padding: 15px 30px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: bold;">
            Secure Login
          </a>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 40px;">
            This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending magic link:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
