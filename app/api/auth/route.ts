import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json();
    
    const passwordPath = path.join(process.cwd(), 'data', 'admin-password.json');
    const passwordData = JSON.parse(fs.readFileSync(passwordPath, 'utf-8'));

    if (keyword === passwordData.keyword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid keyword' }, { status: 401 });
  } catch (error) {
    console.error('Error authenticating:', error);
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}


