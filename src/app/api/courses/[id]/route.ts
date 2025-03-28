import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
          { error: 'Invalid course ID' },
          { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id },
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
    });

    if (!course) {
      return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
        { error: 'Failed to fetch course' },
        { status: 500 }
    );
  }
}