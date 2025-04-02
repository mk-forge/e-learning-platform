"use client";

import React, {useState, useEffect} from "react";
import {Course} from "@/types/course";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {FaBook, FaUsers, FaStar, FaAd, FaImage, FaEdit} from "react-icons/fa";
import toast from "react-hot-toast";
import {CourseCard} from "@/components/Course/CourseCard";

export const CourseManagement = () => {
    const router = useRouter();
    const {data: session} = useSession();
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Course>>({});
    const [error, setError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

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

    async function fetchCourses() {
        try {
            setLoading(true);
            const res = await fetch("/api/courses");
            if (!res.ok) throw new Error("Chyba při načítání kurzů");
            const data: Course[] = await res.json();
            setCourses(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Neznámá chyba");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateCourse(e: React.FormEvent) {
        e.preventDefault();

        if (!editForm.title?.trim()) {
            toast.error("Název kurzu je povinný");
            return;
        }

        try {
            const capacity = editForm.capacity ? Number(editForm.capacity) : null;
            const response = await fetch(`/api/courses/${editForm.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...editForm,
                    capacity,
                    imageUrl: editForm.photoUrl || null
                }),
            });

            if (!response.ok) throw new Error("Nepodařilo se upravit kurz");

            toast.success("Kurz byl úspěšně upraven");
            setEditForm({});
            await fetchCourses();
        } catch (err) {
            toast.error("Nepodařilo se upravit kurz");
        }
    }

    async function handleDeleteCourse(id: number) {
        try {
            const response = await fetch(`/api/courses/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Nepodařilo se smazat kurz");

            toast.success("Kurz byl úspěšně smazán");
            setConfirmDelete(null);
            await fetchCourses();
        } catch (err) {
            toast.error("Nepodařilo se smazat kurz");
        }
    }

    const canEdit = (teacherId: number) => {
        const user = session?.user as { id?: string };
        return user?.id ? Number(user.id) === teacherId : false;
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                    <FaBook className="mr-3 text-blue-500"/>
                    Správa kurzů
                </h1>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowAllCourses(!showAllCourses)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            showAllCourses
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                    >
                        {showAllCourses ? 'Zobrazit jen mé kurzy' : 'Zobrazit všechny kurzy'}
                    </button>

                    <button
                        onClick={() => router.push("/courseManagement/create-course")}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors"
                    >
                        Přidat nový kurz
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {editForm.id && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-green-500">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        <FaEdit className="mr-2 text-green-500"/>
                        Upravit kurz
                    </h2>
                    <form onSubmit={handleUpdateCourse}>
                        <div className="mb-4">
                            <label htmlFor="edit-title" className="block text-gray-700 text-sm font-medium mb-2">
                                Název kurzu *
                            </label>
                            <input
                                id="edit-title"
                                type="text"
                                value={editForm.title || ""}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="edit-description" className="block text-gray-700 text-sm font-medium mb-2">
                                Popis kurzu
                            </label>
                            <textarea
                                id="edit-description"
                                value={editForm.description || ""}
                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="edit-imageUrl"
                                   className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                                <FaImage className="mr-2 text-green-500"/> URL obrázku kurzu
                            </label>
                            <input
                                id="edit-imageUrl"
                                type="text"
                                value={editForm.photoUrl || ""}
                                onChange={(e) => setEditForm({...editForm, photoUrl: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Ponechte prázdné pro výchozí obrázek</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="edit-capacity" className="block text-gray-700 text-sm font-medium mb-2">
                                    <FaUsers className="inline mr-1 text-green-500"/> Kapacita
                                </label>
                                <input
                                    id="edit-capacity"
                                    type="number"
                                    min="1"
                                    value={editForm.capacity || ''}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        capacity: e.target.value ? Number(e.target.value) : null
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                                    <FaStar className="mr-1 text-green-500"/> Premium kurz
                                </label>
                                <div className="flex items-center space-x-2 mt-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            checked={editForm.isPremium === true}
                                            onChange={() => setEditForm({...editForm, isPremium: true})}
                                            className="form-radio h-4 w-4 text-green-500"
                                        />
                                        <span className="ml-2">Ano</span>
                                    </label>
                                    <label className="inline-flex items-center ml-4">
                                        <input
                                            type="radio"
                                            checked={editForm.isPremium === false}
                                            onChange={() => setEditForm({...editForm, isPremium: false})}
                                            className="form-radio h-4 w-4 text-green-500"
                                        />
                                        <span className="ml-2">Ne</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                                    <FaAd className="mr-1 text-green-500"/> Povolit reklamy
                                </label>
                                <div className="flex items-center space-x-2 mt-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            checked={editForm.hasAds === true}
                                            onChange={() => setEditForm({...editForm, hasAds: true})}
                                            className="form-radio h-4 w-4 text-green-500"
                                        />
                                        <span className="ml-2">Ano</span>
                                    </label>
                                    <label className="inline-flex items-center ml-4">
                                        <input
                                            type="radio"
                                            checked={editForm.hasAds === false}
                                            onChange={() => setEditForm({...editForm, hasAds: false})}
                                            className="form-radio h-4 w-4 text-green-500"
                                        />
                                        <span className="ml-2">Ne</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                            <button
                                type="button"
                                onClick={() => setEditForm({})}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Zrušit
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Uložit změny
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            isTeacher={canEdit(course.teacherId)}
                            onEdit={() => setEditForm({
                                id: course.id,
                                title: course.title,
                                description: course.description,
                                teacherId: course.teacherId,
                                capacity: course.capacity,
                                isPremium: course.isPremium,
                                hasAds: course.hasAds,
                                photoUrl: course.photoUrl
                            })}
                            onDelete={() => setConfirmDelete(course.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                        <FaBook className="text-blue-500 text-2xl"/>
                    </div>
                    <p className="text-gray-600 mb-4">
                        {showAllCourses
                            ? "V systému zatím nejsou žádné kurzy."
                            : "Zatím jste nevytvořili žádné kurzy."
                        }
                    </p>
                    <button
                        onClick={() => router.push("/courseManagement/create")}
                        className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-colors"
                    >
                        Vytvořit první kurz
                    </button>
                </div>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-xl font-bold mb-4 text-center">Potvrzení smazání</h3>
                        <p className="mb-6 text-center text-gray-600">
                            Opravdu chcete smazat tento kurz? <br/>
                            <span className="text-red-500 font-medium">Tato akce je nevratná.</span>
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Zrušit
                            </button>
                            <button
                                onClick={() => handleDeleteCourse(confirmDelete)}
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
};