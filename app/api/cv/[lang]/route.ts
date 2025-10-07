import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const { lang } = await params;
    const filePath = path.join(process.cwd(), 'data', `cv-${lang}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading CV:', error);
    return NextResponse.json({ error: 'Error reading CV' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const { lang } = await params;
    const body = await request.json();
    const { keyword, data } = body;

    // Verify admin password
    const passwordPath = path.join(process.cwd(), 'data', 'admin-password.json');
    const passwordData = JSON.parse(fs.readFileSync(passwordPath, 'utf-8'));

    if (keyword !== passwordData.keyword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Save updated CV data
    const filePath = path.join(process.cwd(), 'data', `cv-${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating CV:', error);
    return NextResponse.json({ error: 'Error updating CV' }, { status: 500 });
  }
}


