import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid lecture ID' },
                { status: 400 }
            );
        }

        const lecture = await prisma.lecture.findUnique({
            where: { id },
        });

        if (!lecture) {
            return NextResponse.json(
                { error: 'Lecture not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(lecture);
    } catch (error) {
        console.error('Error fetching lecture:', error);
        return NextResponse.json(
            { error: 'Failed to fetch lecture' },
            { status: 500 }
        );
    }
}

// PUT - Update a specific lecture
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid lecture ID' },
                { status: 400 }
            );
        }

        const body = await request.json();

        // Check if lecture exists
        const existingLecture = await prisma.lecture.findUnique({
            where: { id },
        });

        if (!existingLecture) {
            return NextResponse.json(
                { error: 'Lecture not found' },
                { status: 404 }
            );
        }

        // Update the lecture
        const updatedLecture = await prisma.lecture.update({
            where: { id },
            data: {
                title: body.title !== undefined ? body.title : undefined,
                type: body.type !== undefined ? body.type : undefined,
                content: body.content !== undefined ? body.content : undefined,
                videoUrl: body.videoUrl !== undefined ? body.videoUrl : undefined,
                questions: body.questions !== undefined ? body.questions : undefined,
                order: body.order !== undefined ? body.order : undefined,
            },
        });

        return NextResponse.json(updatedLecture);
    } catch (error) {
        console.error('Error updating lecture:', error);
        return NextResponse.json(
            { error: 'Failed to update lecture' },
            { status: 500 }
        );
    }
}

// DELETE - Remove a specific lecture
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid lecture ID' },
                { status: 400 }
            );
        }

        // Check if lecture exists
        const existingLecture = await prisma.lecture.findUnique({
            where: { id },
        });

        if (!existingLecture) {
            return NextResponse.json(
                { error: 'Lecture not found' },
                { status: 404 }
            );
        }

        // Delete the lecture
        await prisma.lecture.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: 'Lecture deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting lecture:', error);
        return NextResponse.json(
            { error: 'Failed to delete lecture' },
            { status: 500 }
        );
    }
}