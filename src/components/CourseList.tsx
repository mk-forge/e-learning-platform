"use client";

import { useState, useEffect } from "react";
import { Course } from "../types/course";

export const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Chyba pri nacitani kurzu");
      const data: Course[] = await res.json();
      setCourses(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Neznama chyba");
      }
    }
  }

  return (
    <div style={{ padding: "24px", marginTop: "100px" }}>
      <h1 className="text-2xl font-bold mb-2">Seznam kurzů</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border p-4 bg-white rounded-lg shadow-md flex flex-col items-start"
          >
            <h2 className="font-bold text-lg mb-2">{course.title}</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <p className="text-sm text-gray-500">
              <b>Učitel:</b> {course.teacher.firstName + " " + course.teacher.lastName}
            </p>
            <p className="text-sm text-gray-500">
            <b>Datum vytvoření:</b> {new Date(course.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};