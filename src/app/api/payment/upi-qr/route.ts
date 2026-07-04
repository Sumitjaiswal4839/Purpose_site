import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET: Retrieve UPI QR code image
 * This is used during the payment process to show customers the UPI QR
 */
export async function GET() {
  try {
    const qrPath = path.join(process.cwd(), "public", "upi-qr.png");

    // Check if UPI QR file exists
    if (!fs.existsSync(qrPath)) {
      return NextResponse.json(
        {
          error: "UPI QR code not found",
          message: "Please upload your UPI QR code to: public/upi-qr.png",
          instruction: "1. Generate your UPI QR from your UPI app\n2. Save as 'upi-qr.png'\n3. Upload to 'public' folder",
        },
        { status: 404 }
      );
    }

    // Read and return the image
    const imageBuffer = fs.readFileSync(qrPath);
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("UPI QR retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve UPI QR code" },
      { status: 500 }
    );
  }
}
