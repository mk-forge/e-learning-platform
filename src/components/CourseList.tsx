"use client";

import { useState, useEffect } from "react";
import { Course } from "../types/course";

// Pole s obrázky (cesty k obrázkům)
const imageArray: string[] = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyIxiE33bx2t0rTEUln1KrEc7e4TejvtOZPg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPHX0QdVpZVWsnXCaEF3Lp7bSmZ7MIkjL33A&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOAnih04WNhAAe_aolZqky1alLD72EIoEDEA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ28e3mGOO58W9ZYK77RnRWft95Bwr4lg5RQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1QcWyLr7f0bHiBv4ZKw74dpj5sfS98yJPA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuiNAv3RuXflh4VDsij9Onm3Ii7CuQbFJsTQ&s"
];

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
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="border p-4 bg-white rounded-lg shadow-md flex flex-col items-start"
          >
            <img
              src={imageArray[index % imageArray.length] || "https://via.placeholder.com/300"}
              alt={course.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
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