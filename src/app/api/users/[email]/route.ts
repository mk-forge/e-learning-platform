import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
    const { email } = params;

    if (!email) {
        return NextResponse.json({ message: "Email je povinný parametr." }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                enrollments: {
                    include: {
                        course: true
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ message: "Uživatel nenalezen." }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Chyba při načítání uživatele:", error);
        return NextResponse.json({ message: "Chyba serveru." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { email: string } }) {
    const { email } = params;

    if (!email) {
        return NextResponse.json({ message: "Email je povinný parametr." }, { status: 400 });
    }

    try {
        const body = await req.json();
        const { enrollments } = body;

        if (!Array.isArray(enrollments)) {
            return NextResponse.json({ message: "Enrollments musí být pole." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: "Uživatel nenalezen." }, { status: 404 });
        }

        for (const enrollment of enrollments) {
            await prisma.enrollment.upsert({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: enrollment.courseId,
                    },
                },
                update: {},
                create: {
                    userId: user.id,
                    courseId: enrollment.courseId,
                },
            });
        }

        const updatedUser = await prisma.user.findUnique({
            where: { email },
            include: {
                enrollments: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Chyba při aktualizaci uživatele:", error);
        return NextResponse.json({ message: "Chyba serveru." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { email: string } }) {
    const { email } = params;

    if (!email) {
        return NextResponse.json({ message: "Email je povinný parametr." }, { status: 400 });
    }

    try {
        const body = await req.json();
        const { courseId } = body;

        if (!courseId) {
            return NextResponse.json({ message: "ID kurzu je povinné." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: "Uživatel nenalezen." }, { status: 404 });
        }

        const deletedEnrollment = await prisma.enrollment.deleteMany({
            where: {
                userId: user.id,
                courseId: Number(courseId),
            },
        });

        if (deletedEnrollment.count === 0) {
            return NextResponse.json({ message: "Kurz nebyl nalezen nebo uživatel není zapsán." }, { status: 404 });
        }

        return NextResponse.json({ message: "Kurz byl úspěšně odhlášen." }, { status: 200 });
    } catch (error) {
        console.error("Chyba při odhlášení z kurzu:", error);
        return NextResponse.json({ message: "Chyba serveru." }, { status: 500 });
    }
}