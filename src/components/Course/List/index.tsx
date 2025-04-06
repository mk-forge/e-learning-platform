"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { CourseCard } from "@/components/Course/CourseCard";
import { FaBook, FaChalkboardTeacher } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const CourseList = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();
    const userRole = session?.user?.role;

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            setLoading(true);
            const res = await fetch("/api/courses");
            if (!res.ok) {
                console.log("Error fetching courses: ", res.statusText);
                toast.error("Chyba při načítání kurzů")
            }
            const data: Course[] = await res.json();
            setCourses(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Neznámá chyba");
        } finally {
            setLoading(false);
        }
    }

    const handleGoToManagement = () => {
        router.push("/courseManagement");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                    <FaBook className="mr-3 text-blue-500"/>
                    Seznam kurzů
                </h1>

                {/* Management button only for teachers*/}
                {(userRole === 'teacher') && (
                    <button
                        onClick={handleGoToManagement}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <FaChalkboardTeacher className="mr-2"/>
                        Správa kurzů
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                    />
                ))}
            </div>
        </div>
    );
};