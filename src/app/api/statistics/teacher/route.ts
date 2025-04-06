import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');

    if (!courseId) {
        return NextResponse.json(
            { error: 'Course ID is required' },
            { status: 400 }
        );
    }

    try {
        // Get all enrollments for this course
        const enrollments = await prisma.enrollment.findMany({
            where: { courseId: parseInt(courseId) },
        });

        // Get all quiz results for this course
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

        const quizResults = await prisma.quizResult.findMany({
            where: {
                lectureId: { in: quizIds }
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
        const enrolledStudents = enrollments.length;
        const completedQuizzes = quizResults.length;

        // Calculate average score
        const averageScore = quizResults.length > 0
            ? Math.round(quizResults.reduce((acc, result) => acc + result.score, 0) / quizResults.length)
            : 0;

        // Calculate score distribution
        const scoreDistribution = [0, 0, 0, 0, 0]; // 0-20%, 21-40%, 41-60%, 61-80%, 81-100%

        quizResults.forEach(result => {
            const scorePercentage = result.score;
            if (scorePercentage <= 20) scoreDistribution[0]++;
            else if (scorePercentage <= 40) scoreDistribution[1]++;
            else if (scorePercentage <= 60) scoreDistribution[2]++;
            else if (scorePercentage <= 80) scoreDistribution[3]++;
            else scoreDistribution[4]++;
        });

        // Get quiz-specific statistics
        const quizNames = courseQuizzes.map(quiz => quiz.title);
        const quizScores = courseQuizzes.map(quiz => {
            const quizSpecificResults = quizResults.filter(result => result.lectureId === quiz.id);
            return quizSpecificResults.length > 0
                ? Math.round(quizSpecificResults.reduce((acc, result) => acc + result.score, 0) / quizSpecificResults.length)
                : 0;
        });

        return NextResponse.json({
            enrolledStudents,
            completedQuizzes,
            averageScore,
            scoreDistribution,
            quizNames,
            quizScores
        });
    } catch (error) {
        console.error('Error fetching teacher statistics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}