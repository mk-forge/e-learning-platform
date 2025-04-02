"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import Link from "next/link";

export const CourseList = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            setLoading(true);
            const res = await fetch("/api/courses");
            if (!res.ok) throw new Error("Chyba při načítání kurzů");
            const data: Course[] = await res.json();
            setCourses(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Neznámá chyba");
            }
        } finally {
            setLoading(false);
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
        <div style={{ padding: "24px", marginTop: "100px" }}>
            <h1 className="text-2xl font-bold mb-2">Seznam kurzů</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="border p-4 bg-white rounded-lg shadow-md flex flex-col h-full">
                        <img
                            src={course.imageUrl || "/images/courses/courseone.png"}
                            alt={course.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                        <div className="description-container h-20 overflow-hidden mb-4">
                            <p className="text-gray-700">{course.description || "Bez popisu"}</p>
                        </div>
                        <div className="mt-auto">
                            <div className="flex items-center mb-2">
                                <p className="text-sm text-gray-500">
                                    {course.teacher.firstName} {course.teacher.lastName}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                <b>Datum vytvoření:</b> {new Date(course.createdAt).toLocaleDateString()}
                            </p>
                            <Link
                                href={`/courses/${course.id}`}
                                className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"
                            >
                                Podrobnosti
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};