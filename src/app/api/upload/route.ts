import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file received" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '_' + file.name.replaceAll(' ', '_');
        const publicPath = path.join(process.cwd(), 'public', 'uploads');

        await writeFile(path.join(publicPath, filename), buffer);

        return NextResponse.json({
            success: true,
            path: `/uploads/${filename}`
        });
    } catch (error) {
        return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
    }
}