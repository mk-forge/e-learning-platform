import { NextResponse } from 'next/server';
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