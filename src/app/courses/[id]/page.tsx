"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Course } from '@/types/course';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSession } from "next-auth/react";

const courseImageArray: string[] = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1QcWyLr7f0bHiBv4ZKw74dpj5sfS98yJPA&s", // C++
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyIxiE33bx2t0rTEUln1KrEc7e4TejvtOZPg&s", // Python
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPHX0QdVpZVWsnXCaEF3Lp7bSmZ7MIkjL33A&s", // React
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOAnih04WNhAAe_aolZqky1alLD72EIoEDEA&s", // ML
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ28e3mGOO58W9ZYK77RnRWft95Bwr4lg5RQ&s", // PSQL
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuiNAv3RuXflh4VDsij9Onm3Ii7CuQbFJsTQ&s" // Cybersec
];

export default function CourseDetail() {
    const params = useParams();
    const courseId = Number(params.id);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEnrolled, setIsEnrolled] = useState(false);
    const { data: session } = useSession();
    const userRole = session?.user?.role;

    const courseImage = course ? courseImageArray[courseId - 1] : null;

    useEffect(() => {
        async function fetchCourseDetail() {
            try {
                setLoading(true);

                const res = await fetch(`/api/courses/${courseId}`);
                if (!res.ok) throw new Error("Nemohu načíst detail kurzu");
                const data = await res.json();
                setCourse(data);

                if (session && session.user?.email) {
                    const userResponse = await fetch(`/api/users/${session.user.email}`);
                    if (!userResponse.ok) {
                        throw new Error("Chyba při načítání uživatelských dat");
                    }
                    const userData = await userResponse.json();

                    const isUserEnrolled = userData.enrollments.some((enrollment: { courseId: number }) => enrollment.courseId === courseId);
                    setIsEnrolled(isUserEnrolled);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Neznámá chyba");
            } finally {
                setLoading(false);
            }
        }

        if (courseId) {
            fetchCourseDetail();
        }
    }, [courseId, session]);

    async function enrollInCourse(courseId: number) {
        if (!session || !session.user?.email) {
            alert("Musíte být přihlášeni, abyste se mohli zapsat do kurzu.");
            return;
        }

        if (loading) return;

        try {
            setLoading(true);
            const userEmail = session.user.email;

            const updateResponse = await fetch(`/api/users/${userEmail}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    enrollments: [{ courseId }],
                }),
            });

            if (!updateResponse.ok) {
                const errorBody = await updateResponse.text();
                console.error('Chyba při zápisu do kurzu:', errorBody);
                throw new Error("Chyba při zápisu do kurzu");
            }

            const responseBody = await updateResponse.json();
            setIsEnrolled(true);
        } catch (error) {
            console.error('Chyba při zápisu do kurzu:', error);
        } finally {
            setLoading(false);
        }
    }

    async function unenrollFromCourse(courseId: number) {
        if (!session || !session.user?.email) {
            alert("Musíte být přihlášeni, abyste se mohli odhlásit z kurzu.");
            return;
        }
    
        if (loading) return;
    
        try {
            setLoading(true);
            const userEmail = session.user.email;
    
            const response = await fetch(`/api/users/${userEmail}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseId }),
            });
    
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Chyba při odhlášení z kurzu:', errorBody);
                throw new Error("Chyba při odhlášení z kurzu");
            }
    
            const responseBody = await response.json();    
            setIsEnrolled(false);
        } catch (error) {
            console.error('Chyba při odhlášení z kurzu:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto p-8 mt-24">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
                <h2 className="text-xl font-bold mb-2">Chyba</h2>
                <p>{error}</p>
            </div>
        </div>
    );

    if (!course) return (
        <div className="container mx-auto p-8 mt-24">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-700">
                <h2 className="text-xl font-bold mb-2">Kurz nenalezen</h2>
                <p>Požadovaný kurz neexistuje nebo byl odstraněn.</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8 mt-16 md:mt-24 max-w-6xl">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                {/* Hero section with image and overlay */}
                <div className="relative h-64 md:h-96">
                    <img
                        src={courseImage || undefined}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                        <div className="mb-2">
                            {course.isPremium && (
                                <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full mr-2 uppercase tracking-wide">
                                    Premium
                                </span>
                            )}
                            {!course.hasAds && (
                                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Bez reklam
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{course.title}</h1>
                        <div className="flex items-center text-white/90 text-sm">
                            <Icon icon="ph:user-circle-fill" className="w-5 h-5 mr-1" />
                            <span>{course.teacher.firstName} {course.teacher.lastName}</span>
                            <span className="mx-2">•</span>
                            <Icon icon="ph:calendar" className="w-5 h-5 mr-1" />
                            <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
    
                <div className="p-6 md:p-8">
                    {/* Course details */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center">
                                    <Icon icon="ph:info-fill" className="mr-2 text-blue-500" />
                                    O kurzu
                                </h2>
                                <p className="text-gray-700 leading-relaxed">{course.description || "Popis kurzu není k dispozici."}</p>
                            </div>
    
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center">
                                    <Icon icon="ph:graduation-cap-fill" className="mr-2 text-blue-500" />
                                    Co se naučíte
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                                    <li className="flex items-start">
                                        <Icon icon="ph:check-circle-fill" className="mt-1 mr-2 text-green-500 flex-shrink-0" />
                                        <span>Základní koncepty a principy</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Icon icon="ph:check-circle-fill" className="mt-1 mr-2 text-green-500 flex-shrink-0" />
                                        <span>Praktické dovednosti pro reálné využití</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Icon icon="ph:check-circle-fill" className="mt-1 mr-2 text-green-500 flex-shrink-0" />
                                        <span>Pokročilé techniky a metody</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Icon icon="ph:check-circle-fill" className="mt-1 mr-2 text-green-500 flex-shrink-0" />
                                        <span>Tipy pro pokročilé uživatele</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
    
                        <div className="flex-1">
                            <div className="flex flex-col justify-center items-center md:items-start mb-8">
                                {userRole !== "teacher" && (
                                    isEnrolled ? (
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white py-2 px-8 rounded-lg text-lg w-full md:w-auto"
                                        onClick={() => unenrollFromCourse(Number(courseId))}
                                    >
                                        Odhlásit se z kurzu
                                    </button>
                                ) : (
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-lg text-lg w-full md:w-auto"
                                        onClick={() => enrollInCourse(Number(courseId))}
                                    >
                                        Zapsat se do kurzu
                                    </button>
                                )
                            )}
                            </div>
                        </div>

                        <div className="md:w-80 flex-shrink-0">
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <h2 className="text-lg font-bold mb-4 pb-3 border-b border-gray-200">Detaily kurzu</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-center">
                                        <Icon icon="ph:users-three-fill" className="text-gray-500 mr-3 w-5 h-5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Kapacita</div>
                                            <div className="font-medium">{course.capacity || "Neomezená"}</div>
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <Icon icon="ph:crown-fill" className="text-gray-500 mr-3 w-5 h-5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Premium kurz</div>
                                            <div className="font-medium">{course.isPremium ? "Ano" : "Ne"}</div>
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <Icon icon="ph:book-open-fill" className="text-gray-500 mr-3 w-5 h-5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Materiály</div>
                                            <div className="font-medium">{course.materials?.length || 0}</div>
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <Icon icon="ph:clipboard-fill" className="text-gray-500 mr-3 w-5 h-5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Úkoly</div>
                                            <div className="font-medium">{course.assignments?.length || 0}</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}