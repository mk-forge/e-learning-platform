import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file received" }, { status: 400 });
        }

        // Create videos directory if it doesn't exist
        const publicPath = path.join(process.cwd(), 'public', 'videos');
        try {
            await mkdir(publicPath, { recursive: true });
        } catch (error) {
            console.error("Error creating directory:", error);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '_' + file.name.replaceAll(' ', '_');

        await writeFile(path.join(publicPath, filename), buffer);

        return NextResponse.json({
            success: true,
            path: `/videos/${filename}`
        });
    } catch (error) {
        console.error("Error uploading video:", error);
        return NextResponse.json({ error: "Error uploading video" }, { status: 500 });
    }
}