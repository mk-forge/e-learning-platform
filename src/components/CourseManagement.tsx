"use client";

import { useState, useEffect } from "react";
import { Course } from "../types/course";

export const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Pick<Course, "title" | "description" | "teacherId">>({
    title: "",
    description: "",
    teacherId: 0,
  });
  const [editForm, setEditForm] = useState<Partial<Course>>({
    id: undefined,
    title: "",
    description: "",
    teacherId: 0,
  });
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

  async function handleAddCourse(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ title: "", description: "", teacherId: 0 });
      fetchCourses();
    } catch (err) {
      setError("Nepodarilo se pridat kurz");
    }
  }

  async function handleUpdateCourse(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditForm({ id: undefined, title: "", description: "", teacherId: 0 });
      fetchCourses();
    } catch (err) {
      setError("Nepodarilo se upravit kurz");
    }
  }

  async function handleDeleteCourse(id: number) {
    try {
      await fetch("/api/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id }),
      });
      fetchCourses();
    } catch (err) {
      setError("Nepodarilo se smazat kurz");
    }
  }

  return (
    <div style={{ padding: "24px", marginTop: "100px" }}>
      <h1 className="text-2xl font-bold mb-4">Správa kurzů</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleAddCourse} className="mb-6">
        <input
          type="text"
          placeholder="Název kurzu"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Popis kurzu"
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="number"
          placeholder="ID učitele"
          value={form.teacherId}
          onChange={(e) => setForm({ ...form, teacherId: Number(e.target.value) })}
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Přidat kurz
        </button>
      </form>

      {editForm.id && (
        <form onSubmit={handleUpdateCourse} className="mb-6">
          <input
            type="text"
            placeholder="Nový název kurzu"
            value={editForm.title || ""}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Nový popis kurzu"
            value={editForm.description || ""}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="ID učitele"
            value={editForm.teacherId || 0}
            onChange={(e) => setEditForm({ ...editForm, teacherId: Number(e.target.value) })}
            className="border p-2 mb-2 w-full"
          />
          <button type="submit" className="bg-green-500 text-white p-2">
            Uložit změny
          </button>
          <button
            type="button"
            onClick={() => setEditForm({ id: undefined, title: "", description: "", teacherId: 0 })}
            className="bg-gray-500 text-white p-2 ml-2"
          >
            Zrušit
          </button>
        </form>
      )}

      <ul>
        {courses.map((course) => (
          <li key={course.id} className="border p-4 mb-2">
            <h2 className="font-bold">{course.title}</h2>
            <p>{course.description}</p>
            <p>Učitel: {course.teacher.firstName + " " + course.teacher.lastName}</p>
            <p>Datum vytvoření: {new Date(course.createdAt).toLocaleString()}</p>
            <button
              onClick={() =>
                setEditForm({
                  id: course.id,
                  title: course.title,
                  description: course.description,
                  teacherId: course.teacherId,
                })
              }
              className="text-blue-500 mr-4"
            >
              Upravit
            </button>
            <button
              onClick={() => handleDeleteCourse(course.id)}
              className="text-red-500"
            >
              Smazat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
