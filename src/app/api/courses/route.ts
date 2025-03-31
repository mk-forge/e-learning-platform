import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                teacher: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                materials: true,
                assignments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Nepovedlo se získat kurzy, chyba:', error);
        return NextResponse.json(
            { error: 'Nepovedlo se získat kurzy' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validation
        if (!body.title || !body.teacherId) {
            return NextResponse.json(
                { error: 'Title and teacherId are required' },
                { status: 400 }
            );
        }

        const course = await prisma.course.create({
            data: {
                title: body.title,
                description: body.description,
                capacity: body.capacity,
                isPremium: body.isPremium ?? false,
                hasAds: body.hasAds ?? true,
                teacherId: body.teacherId,
            },
        });

        return NextResponse.json(course, { status: 201 });
    } catch (error) {
        console.error('Failed to create course:', error);
        return NextResponse.json(
            { error: 'Failed to create course' },
            { status: 500 }
        );
    }
}