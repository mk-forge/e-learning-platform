"use client";

import {useState, useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Course} from '@/types/course';
import {Icon} from "@iconify/react/dist/iconify.js";
import {useSession} from "next-auth/react";
import {toast} from "react-hot-toast";
import {FaEdit, FaTrash} from "react-icons/fa";
import TeacherStatistics from "@/components/Statistics/TeacherStatistics";
import StudentStatistics from "@/components/Statistics/StudentStatistics";

export default function CourseDetail() {
    const params = useParams();
    const router = useRouter();
    const courseId = Number(params.id);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState("");
    const [isEnrolled, setIsEnrolled] = useState(false);
    const {data: session} = useSession();
    const userRole = session?.user?.role;

    useEffect(() => {
        async function fetchCourseDetail() {
            try {
                setLoading(true);
                const res = await fetch(`/api/courses/${courseId}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setError("Kurz nenalezen");
                        return;
                    }
                    if (res.status === 403) {
                        setError("Nemáte oprávnění zobrazit tento kurz");
                        return;
                    }
                }

                const data = await res.json();
                setCourse(data);

                if (session && session.user?.email) {
                    const userResponse = await fetch(`/api/users/${session.user.email}`);
                    if (!userResponse.ok) {
                        toast.error("Chyba při načítání uživatelských dat");
                        console.log(userResponse);
                    }
                    const userData = await userResponse.json();
                    setIsEnrolled(userData.enrollments.some((enrollment: { courseId: number }) =>
                        enrollment.courseId === courseId
                    ));
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

    const handleEditCourse = () => {
        router.push(`/courseManagement/edit-course/${courseId}`);
    };

    const handleDeleteCourse = async () => {
        try {
            const response = await fetch(`/api/courses/${courseId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.log("Error deleting course:", response.statusText);
                toast.error('Nepodařilo se smazat kurz');
            }

            toast.success('Kurz byl úspěšně smazán');
            router.push('/courseManagement');
        } catch (error) {
            toast.error('Nepodařilo se smazat kurz');
        }
    };

    async function enrollInCourse(courseId: number) {
        if (!session?.user?.email) {
            toast.error("Musíte být přihlášeni.");
            return;
        }

        if (loading) return;

        try {
            setLoading(true);
            const response = await fetch(`/api/users/${session.user.email}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({enrollments: [{courseId}]}),
            });

            if (!response.ok) {
                console.log("Error enrolling in course:", response.statusText);
                if (response.status === 409) {
                    toast.error("Již jste zapsáni do tohoto kurzu.");
                    return;
                }
            }

            setIsEnrolled(true);
            toast.success("Byli jste úspěšně zapsáni do kurzu!");
        } catch (error) {
            toast.error("Nepodařilo se zapsat do kurzu.");
        } finally {
            setLoading(false);
        }
    }

    async function unenrollFromCourse(courseId: number) {
        if (!session?.user?.email) {
            toast.error("Musíte být přihlášeni.");
            return;
        }

        if (loading) return;

        try {
            setLoading(true);
            const response = await fetch(`/api/users/${session.user.email}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({courseId}),
            });

            if (!response.ok) {
                console.log("Error unenrolling from course:", response.statusText);
                toast.error("Nepodařilo se odhlásit z kurzu.");
            }

            setIsEnrolled(false);
            toast.success("Byli jste úspěšně odhlášeni z kurzu.");
        } catch (error) {
            toast.error("Nepodařilo se odhlásit z kurzu.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-8 mt-24">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
                    <h2 className="text-xl font-bold mb-2">Chyba</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mx-auto p-8 mt-24">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-700">
                    <h2 className="text-xl font-bold mb-2">Kurz nenalezen</h2>
                    <p>Požadovaný kurz neexistuje nebo byl odstraněn.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 mt-16 md:mt-24 max-w-7xl">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                {/* Course Image Section */}
                <div className="relative h-72 md:h-96">
                    <img
                        src={course.photoUrl || "/images/courses/courseone.png"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                        <div className="mb-3 flex flex-wrap gap-2">
                            {course.isPremium && (
                                <span
                                    className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Premium
                                </span>
                            )}
                            {!course.hasAds && (
                                <span
                                    className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Bez reklam
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{course.title}</h1>
                        <div className="flex items-center text-white/90 text-sm">
                            <Icon icon="ph:user-circle-fill" className="w-5 h-5 mr-2"/>
                            <span>{course.teacher.firstName} {course.teacher.lastName}</span>
                            <span className="mx-2">•</span>
                            <Icon icon="ph:calendar" className="w-5 h-5 mr-2"/>
                            <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                                    <Icon icon="ph:info-fill" className="mr-2 text-blue-500"/>
                                    O kurzu
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {course.description || "Popis kurzu není k dispozici."}
                                </p>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                                    <Icon icon="ph:graduation-cap-fill" className="mr-2 text-blue-500"/>
                                    Co se naučíte
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <li className="flex items-start">
                                        <Icon icon="ph:check-circle-fill"
                                              className="mt-1 mr-2 text-green-500 flex-shrink-0"/>
                                        <span>Základní koncepty a principy</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Icon icon="ph:check-circle-fill"
                                              className="mt-1 mr-2 text-green-500 flex-shrink-0"/>
                                        <span>Praktické dovednosti pro reálné využití</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Icon icon="ph:check-circle-fill"
                                              className="mt-1 mr-2 text-green-500 flex-shrink-0"/>
                                        <span>Pokročilé techniky a metody</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Icon icon="ph:check-circle-fill"
                                              className="mt-1 mr-2 text-green-500 flex-shrink-0"/>
                                        <span>Tipy pro pokročilé uživatele</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Course Actions */}
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                {userRole === "teacher" && Number(session?.user?.id) === course.teacherId ? (
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleEditCourse}
                                            className="flex items-center justify-center px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                        >
                                            <FaEdit className="mr-2"/>
                                            Upravit kurz
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(true)}
                                            className="flex items-center justify-center px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                        >
                                            <FaTrash className="mr-2"/>
                                            Smazat kurz
                                        </button>
                                        <button
                                            className="flex items-center justify-center px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex-1 sm:flex-initial"
                                        >
                                            <Icon icon="ph:book-open-fill" className="mr-2"/>
                                            Zobrazit kurz
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {isEnrolled ? (
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button
                                                    onClick={() => unenrollFromCourse(courseId)}
                                                    className="flex items-center justify-center px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                                >
                                                    <Icon icon="ph:user-minus-fill" className="mr-2"/>
                                                    Odhlásit se z kurzu
                                                </button>
                                                <button
                                                    className="flex items-center justify-center px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex-1 sm:flex-initial"
                                                >
                                                    <Icon icon="ph:book-open-fill" className="mr-2"/>
                                                    Zobrazit kurz
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => enrollInCourse(courseId)}
                                                className="w-full sm:w-auto flex items-center justify-center px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-lg"
                                            >
                                                <Icon icon="ph:user-plus-fill" className="mr-2"/>
                                                Zapsat se do kurzu
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Course Details Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-24">
                                <h2 className="text-lg font-bold mb-4 pb-3 border-b border-gray-200">
                                    Detaily kurzu
                                </h2>
                                <ul className="space-y-4">
                                    <li className="flex items-center">
                                        <Icon icon="ph:users-three-fill" className="text-gray-500 mr-3 w-5 h-5"/>
                                        <div>
                                            <div className="text-sm text-gray-500">Kapacita</div>
                                            <div className="font-medium">{course.capacity || "Neomezená"}</div>
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <Icon icon="ph:crown-fill" className="text-gray-500 mr-3 w-5 h-5"/>
                                        <div>
                                            <div className="text-sm text-gray-500">Premium kurz</div>
                                            <div className="font-medium">{course.isPremium ? "Ano" : "Ne"}</div>
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <Icon icon="ph:book-open-fill" className="text-gray-500 mr-3 w-5 h-5"/>
                                        <div>
                                            <div className="text-sm text-gray-500">Materiály</div>
                                            <div className="font-medium">{course.materials?.length || 0}</div>
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <Icon icon="ph:clipboard-fill" className="text-gray-500 mr-3 w-5 h-5"/>
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

            {/* Statistics Section */}
            {((userRole === 'teacher' || userRole === 'admin') && course.teacherId === Number(session?.user?.id)) ||
            (userRole === 'student' && isEnrolled && session?.user?.id) ? (
                <div className="mt-8 bg-white shadow-xl rounded-xl overflow-hidden p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">Statistiky kurzu</h2>

                    {/* TeacherStatistics */}
                    {(userRole === 'teacher' || userRole === 'admin') && course.teacherId === Number(session?.user?.id) && (
                        <TeacherStatistics courseId={courseId} />
                    )}

                    {/* StudentStatistics */}
                    {userRole === 'student' && isEnrolled && session?.user?.id && (
                        <StudentStatistics
                            courseId={courseId}
                            studentId={Number(session.user.id)}
                        />
                    )}
                </div>
            ) : null}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-medium mb-4">Potvrdit smazání</h3>
                        <p className="text-gray-600 mb-6">Opravdu chcete smazat tento kurz?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Zrušit
                            </button>
                            <button
                                onClick={() => {
                                    setConfirmDelete(false);
                                    handleDeleteCourse();
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Smazat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
