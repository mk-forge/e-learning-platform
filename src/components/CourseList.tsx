"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import Link from "next/link";

const imageMap: Record<string, string> = {
    "Základy jazyka C++": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1QcWyLr7f0bHiBv4ZKw74dpj5sfS98yJPA&s",
    "Datová analýza v Pythonu": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyIxiE33bx2t0rTEUln1KrEc7e4TejvtOZPg&s",
    "Vývoj pomocí Reactu": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPHX0QdVpZVWsnXCaEF3Lp7bSmZ7MIkjL33A&s",
    "Základy strojového učení": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOAnih04WNhAAe_aolZqky1alLD72EIoEDEA&s",
    "Správa databází s PostgreSQL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ28e3mGOO58W9ZYK77RnRWft95Bwr4lg5RQ&s",
    "Úvod do kybernetické bezpečnosti": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuiNAv3RuXflh4VDsij9Onm3Ii7CuQbFJsTQ&s",
};

export const CourseList = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
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
        }
    }

    return (
        <div style={{ padding: "24px", marginTop: "100px" }}>
            <h1 className="text-2xl font-bold mb-2">Seznam kurzů</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="border p-4 bg-white rounded-lg shadow-md flex flex-col h-full">
                        <img
                            src={imageMap[course.title]}
                            alt={course.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                        <div className="description-container h-20 overflow-hidden mb-4">
                            <p className="text-gray-700">{course.description || "Bez popisu"}</p>
                        </div>
                        <div className="mt-auto">
                            <p className="text-sm text-gray-500">
                                <b>Učitel:</b> {course.teacher.firstName + " " + course.teacher.lastName}
                            </p>
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
