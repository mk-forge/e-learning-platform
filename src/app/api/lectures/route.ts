import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const courseId = url.searchParams.get('courseId');

        if (!courseId) {
            return NextResponse.json(
                { error: 'Course ID is required' },
                { status: 400 }
            );
        }

        const lectures = await prisma.lecture.findMany({
            where: {
                courseId: Number(courseId),
            },
            orderBy: {
                order: 'asc',
            },
        });

        return NextResponse.json(lectures);
    } catch (error) {
        console.error('Error fetching lectures:', error);
        return NextResponse.json(
            { error: 'Failed to fetch lectures' },
            { status: 500 }
        );
    }
}

// POST - Create a new lecture
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.type || !body.courseId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if course exists
        const course = await prisma.course.findUnique({
            where: { id: body.courseId },
        });

        if (!course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        // Create the lecture
        const lecture = await prisma.lecture.create({
            data: {
                title: body.title,
                type: body.type,
                content: body.content || null,
                videoUrl: body.videoUrl || null,
                questions: body.questions || null,
                order: body.order || 1,
                course: {
                    connect: {
                        id: body.courseId,
                    },
                },
            },
        });

        return NextResponse.json(lecture, { status: 201 });
    } catch (error) {
        console.error('Error creating lecture:', error);
        return NextResponse.json(
            { error: 'Failed to create lecture' },
            { status: 500 }
        );
    }
}