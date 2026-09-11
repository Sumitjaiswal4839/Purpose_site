import { v2 as cloudinary } from 'cloudinary';
import { NextResponse, NextRequest } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
    const ALLOWED_TYPES = [
      "image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg",
      "video/mp4", "video/webm", "video/ogg",
      "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3", "audio/webm"
    ];

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File too large. Max size is 50MB." },
        { status: 413 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Allowed: JPG, PNG, WEBP, GIF, MP4, WEBM, MP3, WAV." },
        { status: 415 }
      );
    }

    // Validate that Cloudinary is configured
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.warn('Cloudinary not configured - returning base64 fallback');
      
      // Fallback: Convert to base64 if Cloudinary not configured
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      return NextResponse.json({
        success: true,
        url: dataUrl,
        isBase64: true,
        message: 'Image stored as Base64 (Cloudinary not configured)',
      });
    }

    // Upload to Cloudinary
    const buffer = await file.arrayBuffer();
    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'purpose-proposals',
          resource_type: 'auto',
          public_id: `proposal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(Buffer.from(buffer));
    });

    const uploadResult = result as any;

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      isBase64: false,
    });
  } catch (error: unknown) {
    console.error('Image upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
