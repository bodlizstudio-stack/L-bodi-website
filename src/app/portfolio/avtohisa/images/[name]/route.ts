import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const IMAGE_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export async function GET(
  _request: Request,
  { params }: { params: { name: string } }
) {
  const ext = path.extname(params.name).toLowerCase();
  const mimeType = IMAGE_TYPES[ext];

  if (!mimeType) {
    return new NextResponse('Unsupported image type', { status: 400 });
  }

  const baseDir = path.join(process.cwd(), 'avtohiša', 'apex-motors', 'public', 'slike');
  const filePath = path.join(baseDir, params.name);

  if (!filePath.startsWith(baseDir)) {
    return new NextResponse('Invalid file path', { status: 400 });
  }

  try {
    const file = await readFile(filePath);
    return new NextResponse(file, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Image not found', { status: 404 });
  }
}
