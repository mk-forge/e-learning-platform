import { PrismaClient} from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Create teachers
    const teachers = await Promise.all([
        prisma.user.create({
            data: {
                firstName: 'John',
                lastName: 'Smith',
                email: 'johnSmith@example.com',
                passwordHash: await hash('password123', 10),
                role: 'teacher'
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Maria',
                lastName: 'Garcia',
                email: 'maria.garcia@example.com',
                passwordHash: await hash('password123', 10),
                role: 'teacher'
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'David',
                lastName: 'Wong',
                email: 'david.wong@example.com',
                passwordHash: await hash('password123', 10),
                role: 'teacher'
            },
        })
    ]);

    // Create student
    const student = await prisma.user.create({
        data: {
            firstName: 'Alex',
            lastName: 'Johnson',
            email: 'alex@example.com',
            passwordHash: await hash('password123', 10),
            role: 'student'
        },
    });

    // Create courses linked to teachers
    const courses = await Promise.all([
        prisma.course.create({
            data: {
                title: 'Introduction to Web Development',
                description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
                capacity: 30,
                isPremium: false,
                hasAds: true,
                teacherId: teachers[0].id
            },
        }),
        prisma.course.create({
            data: {
                title: 'Advanced JavaScript Programming',
                description: 'Master advanced JavaScript concepts including closures, promises, and async/await.',
                capacity: 25,
                isPremium: true,
                hasAds: false,
                teacherId: teachers[0].id
            },
        }),
        prisma.course.create({
            data: {
                title: 'Data Science Fundamentals',
                description: 'Introduction to data analysis, visualization, and basic machine learning concepts.',
                capacity: 20,
                isPremium: true,
                hasAds: false,
                teacherId: teachers[1].id
            },
        }),
        prisma.course.create({
            data: {
                title: 'Mobile App Development with React Native',
                description: 'Build cross-platform mobile applications using React Native.',
                capacity: 25,
                isPremium: false,
                hasAds: true,
                teacherId: teachers[2].id
            },
        }),
        prisma.course.create({
            data: {
                title: 'UI/UX Design Principles',
                description: 'Learn the fundamentals of designing user-friendly interfaces and experiences.',
                capacity: 30,
                isPremium: false,
                hasAds: true,
                teacherId: teachers[1].id
            },
        }),
    ]);

    // Enroll student in some courses
    await Promise.all([
        prisma.enrollment.create({
            data: {
                userId: student.id,
                courseId: courses[0].id
            }
        }),
        prisma.enrollment.create({
            data: {
                userId: student.id,
                courseId: courses[2].id
            }
        })
    ]);

    console.log('Database seeded with teachers, courses, and a student');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });