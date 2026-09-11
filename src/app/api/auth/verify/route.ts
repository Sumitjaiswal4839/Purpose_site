import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=MissingToken', req.url));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-for-dev') as { email: string };
    
    // Create response redirecting to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', req.url));
    
    // Create session JWT (lasts 7 days)
    const sessionToken = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET || 'fallback-secret-for-dev', { expiresIn: '7d' });
    
    // Set secure HttpOnly session cookie
    response.cookies.set({
      name: 'purpose_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Set client-readable cookie so UI/Navbar can immediately know login state
    response.cookies.set({
      name: 'purpose_logged_in',
      value: 'true',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.redirect(new URL('/login?error=InvalidToken', req.url));
  }
}
