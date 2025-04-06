"use client";

import React from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {FaUser, FaEnvelope, FaUserTag, FaChalkboardTeacher, FaPlus, FaBook} from "react-icons/fa";
import {useEffect, useState} from "react";
import {Course} from "@/types/course";
import toast from "react-hot-toast";


const TeacherProfilePage = () => {
    const {data: session, status} = useSession();
    const router = useRouter();
    const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacherCourses = async () => {
            if (session?.user?.id) {
                try {
                    const res = await fetch("/api/courses");
                    if (!res.ok) {
                        console.log("Error fetching courses:", res.statusText);
                        toast.error(res.statusText);
                    }

                    const allCourses: Course[] = await res.json();
                    // Filter courses for the current teacher
                    const teacherId = Number(session.user.id);
                    const filteredCourses = allCourses.filter(course => course.teacherId === teacherId);
                    setTeacherCourses(filteredCourses);
                } catch (err) {
                    console.error("Error fetching teacher courses:", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (session?.user?.id) {
            fetchTeacherCourses();
        }
    }, [session]);

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    <p className="font-medium">Přístup odepřen. Nejste přihlášeni.</p>
                </div>
            </div>
        );
    }

    const user = session?.user;

    if (user?.role !== "teacher") {
        router.push("/profile");
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-10 mt-20">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FaChalkboardTeacher className="mr-3 text-blue-500"/>
                Profil učitele
            </h1>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {session?.user && "photoUrl" in session.user && session.user.photoUrl ? (
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                                <img
                                    src={session.user.photoUrl as string}
                                    alt={`${user?.firstName} ${user?.lastName}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ): (
                            <div className="bg-white rounded-full p-4 shadow-md">
                                <FaChalkboardTeacher className="text-5xl text-indigo-500"/>
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
                            <p className="text-indigo-100 capitalize font-medium">Učitel</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-1 text-gray-500">
                                <FaUser className="mr-2"/>
                                <span className="text-sm font-medium">Jméno</span>
                            </div>
                            <p className="text-gray-700 font-medium pl-6">{user?.firstName} {user?.lastName}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-1 text-gray-500">
                                <FaEnvelope className="mr-2"/>
                                <span className="text-sm font-medium">E-mail</span>
                            </div>
                            <p className="text-gray-700 font-medium pl-6">{user?.email}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-1 text-gray-500">
                                <FaUserTag className="mr-2"/>
                                <span className="text-sm font-medium">Role</span>
                            </div>
                            <p className="text-gray-700 capitalize font-medium pl-6">{user?.role}</p>
                        </div>
                    </div>


                </div>
            </div>

            {/* Teacher's Courses Section */}
            <div className="mt-8">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                            <FaBook className="mr-2 text-indigo-500"/>
                            Moje kurzy
                        </h2>

                        <div className="mt-4">
                            <button
                                onClick={() => router.push("/courseManagement")}
                                className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                <FaPlus className="mr-2"/>
                                Vytvořit nový kurz
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : teacherCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {teacherCourses.map((course) => (
                                    <div key={course.id}
                                         className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="h-40 overflow-hidden">
                                            <img
                                                src={course.photoUrl || "/images/courses/courseone.png"}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium">{course.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {course.description || "Bez popisu"}
                                            </p>
                                            <div className="flex justify-between items-center mt-3">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {course.isPremium ? "Premium" : "Free"}
                        </span>
                                                <a
                                                    href={`/courses/${course.id}`}
                                                    className="text-indigo-500 hover:text-indigo-700 text-sm flex items-center"
                                                >
                                                    Přejít na kurz →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <p className="text-gray-500 mb-4">Zatím jste nevytvořili žádné kurzy.</p>
                                <button
                                    onClick={() => router.push("/courseManagement")}
                                    className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    <FaPlus className="mr-2"/>
                                    Vytvořit první kurz
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfilePage;