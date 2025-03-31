import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
  const courseId = Number(params.id);

  if (isNaN(courseId)) {
    return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
    );
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
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
    console.error('Failed to fetch course:', error);
    return NextResponse.json(
        { error: 'Failed to fetch course' },
        { status: 500 }
    );
  }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
  const courseId = Number(params.id);

  if (isNaN(courseId)) {
    return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
    );
  }

  try {
    const body = await req.json();

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: body.title,
        description: body.description,
        capacity: body.capacity,
        isPremium: body.isPremium,
        hasAds: body.hasAds,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Failed to update course:', error);
    return NextResponse.json(
        { error: 'Failed to update course' },
        { status: 500 }
    );
  }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
  const courseId = Number(params.id);

  if (isNaN(courseId)) {
    return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
    );
  }

  try {
    // First delete related records
    await prisma.$transaction([
      prisma.enrollment.deleteMany({
        where: { courseId },
      }),
      prisma.material.deleteMany({
        where: { courseId },
      }),
      prisma.assignment.deleteMany({
        where: { courseId },
      }),
      prisma.chatMessage.deleteMany({
        where: { courseId },
      }),
      prisma.testResult.deleteMany({
        where: { courseId },
      }),
      prisma.finalTest.deleteMany({
        where: { courseId },
      }),
      prisma.voiceChannel.deleteMany({
        where: { courseId },
      }),
      // Finally delete the course
      prisma.course.delete({
        where: { id: courseId },
      }),
    ]);

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Failed to delete course:', error);
    return NextResponse.json(
        { error: 'Failed to delete course' },
        { status: 500 }
    );
  }
}

