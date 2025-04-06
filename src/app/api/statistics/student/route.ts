import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');

    if (!courseId || !studentId) {
        return NextResponse.json(
            { error: 'Course ID and Student ID are required' },
            { status: 400 }
        );
    }

    try {
        // Get all quizzes for this course
        const courseQuizzes = await prisma.lecture.findMany({
            where: {
                courseId: parseInt(courseId),
                type: 'quiz'
            },
            select: {
                id: true,
                title: true,
            }
        });

        const quizIds = courseQuizzes.map(quiz => quiz.id);

        // Get student's quiz results
        const studentResults = await prisma.quizResult.findMany({
            where: {
                lectureId: { in: quizIds },
                studentId: parseInt(studentId)
            },
            include: {
                lecture: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                dateTaken: 'desc'
            }
        });

        // Get all students' results for comparison
        const allResults = await prisma.quizResult.findMany({
            where: {
                lectureId: { in: quizIds },
            },
            include: {
                lecture: {
                    select: {
                        title: true
                    }
                }
            }
        });

        // Calculate statistics
        const completedQuizzes = studentResults.length;

        // Calculate average score
        const averageScore = studentResults.length > 0
            ? Math.round(studentResults.reduce((acc, result) => acc + result.score, 0) / studentResults.length)
            : 0;

        // Find best score
        const bestScore = studentResults.length > 0
            ? Math.max(...studentResults.map(result => result.score))
            : 0;

        // Prepare quiz-specific data
        const quizNames = courseQuizzes.map(quiz => quiz.title);

        // Student's scores for each quiz
        const scores = courseQuizzes.map(quiz => {
            const result = studentResults.find(result => result.lectureId === quiz.id);
            return result ? result.score : null;
        });

        // Average scores for each quiz
        const averageScores = courseQuizzes.map(quiz => {
            const quizSpecificResults = allResults.filter(result => result.lectureId === quiz.id);
            return quizSpecificResults.length > 0
                ? Math.round(quizSpecificResults.reduce((acc, result) => acc + result.score, 0) / quizSpecificResults.length)
                : 0;
        });

        // Format results for table display
        const quizResults = studentResults.map(result => ({
            id: result.id,
            quizName: result.lecture.title,
            dateTaken: result.dateTaken,
            score: result.score
        }));

        return NextResponse.json({
            completedQuizzes,
            averageScore,
            bestScore,
            quizNames,
            scores,
            averageScores,
            quizResults
        });
    } catch (error) {
        console.error('Error fetching student statistics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}