import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.delete("purpose_session");
  response.cookies.delete("purpose_logged_in");
  return response;
}
