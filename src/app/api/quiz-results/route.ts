import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.studentId || !body.lectureId || body.score === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const quizResult = await prisma.quizResult.create({
            data: {
                studentId: body.studentId,
                lectureId: body.lectureId,
                score: body.score,
                maxScore: body.maxScore || 0,
                answers: body.answers || null,
            },
        });

        return NextResponse.json(quizResult, { status: 201 });
    } catch (error) {
        console.error('Error saving quiz result:', error);
        return NextResponse.json(
            { error: 'Failed to save quiz result' },
            { status: 500 }
        );
    }
}

// GET endpoint for retrieving quiz results for a student
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const lectureId = searchParams.get('lectureId');

    if (!studentId) {
        return NextResponse.json(
            { error: 'Student ID is required' },
            { status: 400 }
        );
    }

    try {
        const filters: any = { studentId: parseInt(studentId) };
        if (lectureId) {
            filters.lectureId = parseInt(lectureId);
        }

        const results = await prisma.quizResult.findMany({
            where: filters,
            orderBy: { dateTaken: 'desc' },
        });

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quiz results' },
            { status: 500 }
        );
    }
}