import {PrismaClient} from '@prisma/client';
import {hash} from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Create teachers with photos
    const teachers = await Promise.all([
        prisma.user.create({
            data: {
                firstName: 'John',
                lastName: 'Smith',
                email: 'johnSmith@example.com',
                passwordHash: await hash('password123', 10),
                role: 'teacher',
                photoUrl: '/images/mentor/user1.png'
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Maria',
                lastName: 'Garcia',
                email: 'maria.garcia@example.com',
                passwordHash: await hash('password123', 10),
                role: 'teacher',
                photoUrl: '/images/mentor/user2.png'
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'David',
                lastName: 'Wong',
                email: 'david.wong@example.com',
                passwordHash: await hash('password123', 10),
                role: 'teacher',
                photoUrl: '/images/mentor/user3.png'
            },
        })
    ]);

    // Create students with photos
    const students = await Promise.all([
        prisma.user.create({
            data: {
                firstName: 'Alex',
                lastName: 'Johnson',
                email: 'alex@example.com',
                passwordHash: await hash('password123', 10),
                role: 'student',
                photoUrl: '/images/testimonial/user.svg'
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Sophie',
                lastName: 'Miller',
                email: 'sophie@example.com',
                passwordHash: await hash('password123', 10),
                role: 'student',
                photoUrl: '/images/testimonial/user.svg'
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Michael',
                lastName: 'Brown',
                email: 'michael@example.com',
                passwordHash: await hash('password123', 10),
                role: 'student',
                photoUrl: '/images/testimonial/user.svg'
            },
        }),
        prisma.user.create({
            data: {
                firstName: 'Emily',
                lastName: 'Davis',
                email: 'emily@example.com',
                passwordHash: await hash('password123', 10),
                role: 'student',
                photoUrl: '/images/testimonial/user.svg'
            },
        })
    ]);

    // Create courses with images
    const courses = await Promise.all([
        prisma.course.create({
            data: {
                title: 'Introduction to Web Development',
                description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
                capacity: 30,
                isPremium: false,
                hasAds: true,
                teacherId: teachers[0].id,
                photoUrl: '/images/courses/courseone.png',
                stripeId: null
            },
        }),
        prisma.course.create({
            data: {
                title: 'Advanced JavaScript Programming',
                description: 'Master advanced JavaScript concepts including closures, promises, and async/await.',
                capacity: 25,
                isPremium: true,
                hasAds: false,
                teacherId: teachers[0].id,
                photoUrl: '/images/courses/coursetwo.png',
                stripeId: 'https://buy.stripe.com/test_bIYeXBd6scHjbN64gj'
            },
        }),
        prisma.course.create({
            data: {
                title: 'Data Science Fundamentals',
                description: 'Introduction to data analysis, visualization, and basic machine learning concepts.',
                capacity: 20,
                isPremium: true,
                hasAds: false,
                teacherId: teachers[1].id,
                photoUrl: '/images/courses/coursethree.png',
                stripeId: 'https://buy.stripe.com/test_fZebLp4zWdLn7wQ9AC'
            },
        }),
        prisma.course.create({
            data: {
                title: 'Mobile App Development with React Native',
                description: 'Build cross-platform mobile applications using React Native.',
                capacity: 25,
                isPremium: false,
                hasAds: true,
                teacherId: teachers[2].id,
                photoUrl: '/images/courses/courseone.png',
                stripeId: null
            },
        }),
        prisma.course.create({
            data: {
                title: 'UI/UX Design Principles',
                description: 'Learn the fundamentals of designing user-friendly interfaces and experiences.',
                capacity: 30,
                isPremium: false,
                hasAds: true,
                teacherId: teachers[1].id,
                photoUrl: '/images/courses/coursetwo.png',
                stripeId: null
            },
        }),
    ]);

    // Enroll students in courses
    await Promise.all([
        // Alex in courses
        prisma.enrollment.create({
            data: {
                userId: students[0].id,
                courseId: courses[0].id
            }
        }),
        prisma.enrollment.create({
            data: {
                userId: students[0].id,
                courseId: courses[2].id
            }
        }),
        // Sophie in courses
        prisma.enrollment.create({
            data: {
                userId: students[1].id,
                courseId: courses[0].id
            }
        }),
        prisma.enrollment.create({
            data: {
                userId: students[1].id,
                courseId: courses[1].id
            }
        }),
        // Michael in courses
        prisma.enrollment.create({
            data: {
                userId: students[2].id,
                courseId: courses[0].id
            }
        }),
        prisma.enrollment.create({
            data: {
                userId: students[2].id,
                courseId: courses[3].id
            }
        }),
        // Emily in courses
        prisma.enrollment.create({
            data: {
                userId: students[3].id,
                courseId: courses[0].id
            }
        }),
        prisma.enrollment.create({
            data: {
                userId: students[3].id,
                courseId: courses[4].id
            }
        })
    ]);

    // Create lectures with quiz content for Web Development course
    const webDevLectures = await Promise.all([
        prisma.lecture.create({
            data: {
                title: 'HTML Basics',
                type: 'text',
                content: 'Introduction to HTML tags and structure.',
                order: 1,
                courseId: courses[0].id
            }
        }),
        prisma.lecture.create({
            data: {
                title: 'CSS Fundamentals',
                type: 'text',
                content: 'Learn how to style your HTML with CSS.',
                order: 2,
                courseId: courses[0].id
            }
        }),
        prisma.lecture.create({
            data: {
                title: 'HTML & CSS Quiz',
                type: 'quiz',
                questions: JSON.stringify([
                    {
                        question: 'Which tag is used for creating a hyperlink?',
                        options: ['<link>', '<a>', '<href>', '<url>'],
                        correctAnswer: '<a>'
                    },
                    {
                        question: 'Which CSS property is used to change the text color?',
                        options: ['text-color', 'font-color', 'color', 'text-style'],
                        correctAnswer: 'color'
                    },
                    {
                        question: 'Which CSS selector targets an element with id="header"?',
                        options: ['.header', '#header', 'header', '*header'],
                        correctAnswer: '#header'
                    },
                    {
                        question: 'Which HTML tag is used for creating a paragraph?',
                        options: ['<p>', '<paragraph>', '<text>', '<para>'],
                        correctAnswer: '<p>'
                    },
                    {
                        question: 'Which property is used to set the background color in CSS?',
                        options: ['bg-color', 'color-bg', 'background', 'background-color'],
                        correctAnswer: 'background-color'
                    }
                ]),
                order: 3,
                courseId: courses[0].id
            }
        }),
        prisma.lecture.create({
            data: {
                title: 'JavaScript Basics',
                type: 'video',
                videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
                content: 'Introduction to JavaScript variables, functions, and basic concepts.',
                order: 4,
                courseId: courses[0].id
            }
        }),
        prisma.lecture.create({
            data: {
                title: 'DOM Manipulation',
                type: 'text',
                content: 'Learn how to manipulate HTML elements using JavaScript.',
                order: 5,
                courseId: courses[0].id
            }
        }),
        prisma.lecture.create({
            data: {
                title: 'JavaScript Quiz',
                type: 'quiz',
                questions: JSON.stringify([
                    {
                        question: 'Which keyword is used to declare a variable in JavaScript?',
                        options: ['var', 'int', 'string', 'variable'],
                        correctAnswer: 'var'
                    },
                    {
                        question: 'What will "2" + 2 evaluate to in JavaScript?',
                        options: ['4', '22', 'error', 'undefined'],
                        correctAnswer: '22'
                    },
                    {
                        question: 'Which method is used to add an element at the end of an array?',
                        options: ['push()', 'append()', 'add()', 'insert()'],
                        correctAnswer: 'push()'
                    },
                    {
                        question: 'What is the correct way to check if "x" is equal to 5 in JavaScript?',
                        options: ['x = 5', 'x == 5', 'x === 5', 'x => 5'],
                        correctAnswer: 'x === 5'
                    },
                    {
                        question: 'Which function is used to parse a string to an integer in JavaScript?',
                        options: ['Integer.parse()', 'parseInteger()', 'parseInt()', 'toInt()'],
                        correctAnswer: 'parseInt()'
                    }
                ]),
                order: 6,
                courseId: courses[0].id
            }
        }),
    ]);

    // Create lectures with quiz content for Advanced JavaScript course
    const advJsLectures = await Promise.all([
        prisma.lecture.create({
            data: {
                title: 'Closures and Scope',
                type: 'text',
                content: 'Understanding JavaScript closures and scope chains.',
                order: 1,
                courseId: courses[1].id
            }
        }),
        prisma.lecture.create({
            data: {
                title: 'Advanced Scope Quiz',
                type: 'quiz',
                questions: JSON.stringify([
                    {
                        question: 'What is a closure in JavaScript?',
                        options: [
                            'A way to close a browser window',
                            'A function that has access to variables from its outer function scope',
                            'A method to terminate a loop',
                            'A way to restrict access to variables'
                        ],
                        correctAnswer: 'A function that has access to variables from its outer function scope'
                    },
                    {
                        question: 'Which scope has the highest precedence in JavaScript?',
                        options: ['Global scope', 'Function scope', 'Block scope', 'Module scope'],
                        correctAnswer: 'Function scope'
                    },
                    {
                        question: 'What is hoisting in JavaScript?',
                        options: [
                            'Moving elements up with CSS',
                            'The behavior of moving declarations to the top of their scope',
                            'Lifting variables to global scope',
                            'A deprecated JavaScript feature'
                        ],
                        correctAnswer: 'The behavior of moving declarations to the top of their scope'
                    }
                ]),
                order: 2,
                courseId: courses[1].id
            }
        }),
    ]);

    // Create quiz results for Web Development HTML & CSS Quiz
    const htmlCssQuizId = webDevLectures[2].id;
    await Promise.all([
        // Alex's quiz results
        prisma.quizResult.create({
            data: {
                studentId: students[0].id,
                lectureId: htmlCssQuizId,
                score: 85,
                maxScore: 100,
                answers: JSON.stringify({
                    0: '<a>',       // Correct
                    1: 'color',     // Correct
                    2: '#header',   // Correct
                    3: '<text>',    // Incorrect
                    4: 'background-color' // Correct
                }),
                dateTaken: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
            }
        }),
        // Sophie's quiz results
        prisma.quizResult.create({
            data: {
                studentId: students[1].id,
                lectureId: htmlCssQuizId,
                score: 60,
                maxScore: 100,
                answers: JSON.stringify({
                    0: '<a>',       // Correct
                    1: 'font-color', // Incorrect
                    2: '#header',   // Correct
                    3: '<paragraph>', // Incorrect
                    4: 'background-color' // Correct
                }),
                dateTaken: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
            }
        }),
        // Michael's quiz results
        prisma.quizResult.create({
            data: {
                studentId: students[2].id,
                lectureId: htmlCssQuizId,
                score: 95,
                maxScore: 100,
                answers: JSON.stringify({
                    0: '<a>',       // Correct
                    1: 'color',     // Correct
                    2: '#header',   // Correct
                    3: '<p>',       // Correct
                    4: 'bg-color'   // Incorrect
                }),
                dateTaken: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
            }
        }),
        // Emily's quiz results
        prisma.quizResult.create({
            data: {
                studentId: students[3].id,
                lectureId: htmlCssQuizId,
                score: 80,
                maxScore: 100,
                answers: JSON.stringify({
                    0: '<a>',       // Correct
                    1: 'color',     // Correct
                    2: '.header',   // Incorrect
                    3: '<p>',       // Correct
                    4: 'background-color' // Correct
                }),
                dateTaken: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
            }
        }),
    ]);

    // Create quiz results for Web Development JavaScript Quiz
    const jsQuizId = webDevLectures[5].id;
    await Promise.all([
        // Alex's quiz results
        prisma.quizResult.create({
            data: {
                studentId: students[0].id,
                lectureId: jsQuizId,
                score: 75,
                maxScore: 100,
                answers: JSON.stringify({
                    0: 'var',       // Correct
                    1: '22',        // Correct
                    2: 'push()',    // Correct
                    3: 'x == 5',    // Incorrect
                    4: 'toInt()'    // Incorrect
                }),
                dateTaken: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
            }
        }),
        // Sophie's quiz results
        prisma.quizResult.create({
            data: {
                studentId: students[1].id,
                lectureId: jsQuizId,
                score: 90,
                maxScore: 100,
                answers: JSON.stringify({
                    0: 'var',       // Correct
                    1: '22',        // Correct
                    2: 'push()',    // Correct
                    3: 'x === 5',   // Correct
                    4: 'parseInt()' // Correct (fixed from earlier)
                }),
                dateTaken: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
            }
        }),
        // Michael's quiz results
        prisma.quizResult.create({
            data: {
                studentId: students[2].id,
                lectureId: jsQuizId,
                score: 65,
                maxScore: 100,
                answers: JSON.stringify({
                    0: 'var',       // Correct
                    1: '4',         // Incorrect
                    2: 'push()',    // Correct
                    3: 'x === 5',   // Correct
                    4: 'parseInteger()' // Incorrect
                }),
                dateTaken: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            }
        }),
        // Emily's quiz results
        prisma.quizResult.create({
            data: {
                studentId: students[3].id,
                lectureId: jsQuizId,
                score: 85,
                maxScore: 100,
                answers: JSON.stringify({
                    0: 'var',       // Correct
                    1: '22',        // Correct
                    2: 'push()',    // Correct
                    3: 'x === 5',   // Correct
                    4: 'parseInteger()' // Incorrect
                }),
                dateTaken: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            }
        }),
    ]);

    // Create quiz results for Advanced JavaScript Quiz
    const advJsQuizId = advJsLectures[1].id;
    await Promise.all([
        // Sophie's Advanced JS quiz result
        prisma.quizResult.create({
            data: {
                studentId: students[1].id,
                lectureId: advJsQuizId,
                score: 70,
                maxScore: 100,
                answers: JSON.stringify({
                    0: 'A function that has access to variables from its outer function scope', // Correct
                    1: 'Global scope', // Incorrect
                    2: 'The behavior of moving declarations to the top of their scope' // Correct
                }),
                dateTaken: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            }
        }),
    ]);

    // Create some test results for final tests
    await Promise.all([
        // Create a final test for Web Development course
        prisma.finalTest.create({
            data: {
                courseId: courses[0].id,
                title: 'Web Development Final Assessment',
                content: 'Comprehensive test covering HTML, CSS, and JavaScript fundamentals.'
            }
        }),
        // Create test results for the Web Development final test
        prisma.testResult.create({
            data: {
                studentId: students[0].id,
                courseId: courses[0].id,
                score: 82,
                answers: JSON.stringify({
                    // Simplified mock data for test answers
                    'q1': 'answer1',
                    'q2': 'answer2',
                    'q3': 'answer3'
                }),
                dateTaken: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            }
        }),
        prisma.testResult.create({
            data: {
                studentId: students[1].id,
                courseId: courses[0].id,
                score: 75,
                answers: JSON.stringify({
                    'q1': 'answer1',
                    'q2': 'incorrect',
                    'q3': 'answer3'
                }),
                dateTaken: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            }
        }),
    ]);

    console.log('Database seeded with teachers, students, courses, lectures, and quiz results');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });