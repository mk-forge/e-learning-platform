"use client";

import React, { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaBook, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { CourseCard } from "@/components/Course/CourseCard";

export const CourseManagement = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [error, setError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchCourses() {
        try {
            setLoading(true);
            const res = await fetch("/api/courses");
            if (!res.ok) {
                console.log(res);
                toast.error("Chyba při načítání kurzů");
            }

            const data: Course[] = await res.json();
            setCourses(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Neznámá chyba");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (courses.length > 0 && session?.user) {
            const user = session.user as { id?: string };
            const userId = user.id ? Number(user.id) : 0;
            const teacherCourses = courses.filter(course => course.teacherId === userId);
            setFilteredCourses(showAllCourses ? courses : teacherCourses);
        }
    }, [courses, session, showAllCourses]);

    async function handleDeleteCourse(id: number) {
        try {
            const response = await fetch(`/api/courses/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                console.log(response);
                toast.error("Nepodařilo se smazat kurz");
            }

            toast.success("Kurz byl úspěšně smazán");
            setConfirmDelete(null);
            fetchCourses();
        } catch (err) {
            toast.error("Nepodařilo se smazat kurz");
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                    <FaBook className="mr-3 text-blue-500"/>
                    Správa kurzů
                </h1>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => setShowAllCourses(!showAllCourses)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        {showAllCourses ? "Zobrazit mé kurzy" : "Zobrazit všechny kurzy"}
                    </button>
                    <button
                        onClick={() => router.push("/courseManagement/create-course")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <FaPlus className="inline mr-2"/>
                        Vytvořit kurz
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        isTeacher={true}
                        onEdit={() => router.push(`/courseManagement/edit-course/${course.id}`)}
                        onDelete={() => setConfirmDelete(course.id)}
                    />
                ))}
            </div>

            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-medium mb-4">Potvrdit smazání</h3>
                        <p className="text-gray-600 mb-6">Opravdu chcete smazat tento kurz?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Zrušit
                            </button>
                            <button
                                onClick={() => confirmDelete && handleDeleteCourse(confirmDelete)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Smazat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};