"use client";

import React, {useState, useEffect} from "react";
import {Course} from "@/types/course";
import {useSession} from "next-auth/react";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaBook,
    FaUserTie,
    FaCalendarAlt,
    FaInfoCircle,
    FaUsers,
    FaStar,
    FaAd,
    FaImage
} from "react-icons/fa";
import toast from "react-hot-toast";

export const CourseManagement = () => {
    const {data: session} = useSession();
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [form, setForm] = useState<Pick<Course, "title" | "description" | "teacherId" | "capacity" | "isPremium" | "hasAds" | "photoUrl">>({
        title: "",
        description: "",
        teacherId: 0,
        capacity: null,
        isPremium: false,
        hasAds: true,
        photoUrl: "" // Added imageUrl field
    });
    const [editForm, setEditForm] = useState<Partial<Course>>({
        id: undefined,
        title: "",
        description: "",
        teacherId: 0,
        capacity: null,
        isPremium: false,
        hasAds: true,
        photoUrl: "" // Added imageUrl field
    });
    const [error, setError] = useState("");
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            // Access user.id safely through type assertion
            const user = session.user as { id?: string };
            const teacherId = user.id ? Number(user.id) : 0;
            setForm(prev => ({...prev, teacherId}));
        }
        fetchCourses();
    }, [session]);

    useEffect(() => {
        if (courses.length > 0 && session?.user) {
            // Access user.id safely through type assertion
            const user = session.user as { id?: string };
            const userId = user.id ? Number(user.id) : 0;
            // Filter courses where teacherId matches the user's ID
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
            setLoading(false);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Neznámá chyba");
            }
            setLoading(false);
        }
    }

    async function handleAddCourse(e: React.FormEvent) {
        e.preventDefault();

        if (!form.title.trim()) {
            toast.error("Název kurzu je povinný");
            return;
        }

        try {
            // Access user.id safely through type assertion
            const user = session?.user as { id?: string };
            const teacherId = user?.id ? Number(user.id) : 0;
            // Convert capacity to number or null
            const capacity = form.capacity ? Number(form.capacity) : null;

            const response = await fetch("/api/courses", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    teacherId: teacherId,
                    capacity: capacity,
                    isPremium: form.isPremium,
                    hasAds: form.hasAds,
                    imageUrl: form.photoUrl || null // Added imageUrl field
                }),
            });

            if (!response.ok) {
                throw new Error("Nepodařilo se přidat kurz");
            }

            toast.success("Kurz byl úspěšně přidán");
            setForm({
                title: "",
                description: "",
                teacherId,
                capacity: null,
                isPremium: false,
                hasAds: true,
                photoUrl: "" // Reset imageUrl field
            });
            setIsAddingCourse(false);
            await fetchCourses();
        } catch (err) {
            toast.error("Nepodařilo se přidat kurz");
        }
    }

    async function handleUpdateCourse(e: React.FormEvent) {
        e.preventDefault();

        if (!editForm.title?.trim()) {
            toast.error("Název kurzu je povinný");
            return;
        }

        try {
            // Convert capacity to number or null
            const capacity = editForm.capacity ? Number(editForm.capacity) : null;

            // Use the course ID in the URL to update a specific course
            const response = await fetch(`/api/courses/${editForm.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...editForm,
                    capacity,
                    imageUrl: editForm.photoUrl || null // Include imageUrl in the update
                }),
            });

            if (!response.ok) {
                throw new Error("Nepodařilo se upravit kurz");
            }

            toast.success("Kurz byl úspěšně upraven");
            setEditForm({
                id: undefined,
                title: "",
                description: "",
                teacherId: 0,
                capacity: null,
                isPremium: false,
                hasAds: true,
                photoUrl: "" // Reset imageUrl field
            });
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

            if (!response.ok) {
                throw new Error("Nepodařilo se smazat kurz");
            }

            toast.success("Kurz byl úspěšně smazán");
            setConfirmDelete(null);
            await fetchCourses();
        } catch (err) {
            toast.error("Nepodařilo se smazat kurz");
        }
    }

    const canEdit = (teacherId: number) => {
        // Access user.id safely through type assertion
        const user = session?.user as { id?: string };
        return user?.id ? Number(user.id) === teacherId : false;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-6">
                    <FaBook className="mr-3 text-blue-500"/>
                    <span className="inline-block">Správa kurzů</span>
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
                        onClick={() => setIsAddingCourse(!isAddingCourse)}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors"
                    >
                        <FaPlus className="mr-2"/>
                        <span>Přidat kurz</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                    <div className="flex items-center">
                        <FaInfoCircle className="text-red-500 mr-2"/>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {isAddingCourse && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-blue-500">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        <FaPlus className="mr-2 text-blue-500"/>
                        Nový kurz
                    </h2>
                    <form onSubmit={handleAddCourse}>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">Název kurzu
                                *</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Název kurzu"
                                value={form.title}
                                onChange={(e) => setForm({...form, title: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Popis
                                kurzu</label>
                            <textarea
                                id="description"
                                placeholder="Popis kurzu"
                                value={form.description ?? ''}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            />
                        </div>

                        {/* Add image URL field */}
                        <div className="mb-4">
                            <label htmlFor="imageUrl"
                                   className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                                <FaImage className="mr-2 text-blue-500"/> URL obrázku kurzu
                            </label>
                            <input
                                id="imageUrl"
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={form.photoUrl || ""}
                                onChange={(e) => setForm({...form, photoUrl: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Ponechte prázdné pro výchozí obrázek</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="capacity" className="block text-gray-700 text-sm font-medium mb-2">
                                    <FaUsers className="inline mr-1 text-blue-500"/> Kapacita
                                </label>
                                <input
                                    id="capacity"
                                    type="number"
                                    min="1"
                                    placeholder="Neomezená"
                                    value={form.capacity || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        capacity: e.target.value ? Number(e.target.value) : null
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                                    <FaStar className="mr-1 text-blue-500"/> Premium kurz
                                </label>
                                <div className="flex items-center space-x-2 mt-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="isPremium"
                                            checked={form.isPremium}
                                            onChange={() => setForm({...form, isPremium: true})}
                                            className="form-radio h-4 w-4 text-blue-500"
                                        />
                                        <span className="ml-2">Ano</span>
                                    </label>
                                    <label className="inline-flex items-center ml-4">
                                        <input
                                            type="radio"
                                            name="isPremium"
                                            checked={!form.isPremium}
                                            onChange={() => setForm({...form, isPremium: false})}
                                            className="form-radio h-4 w-4 text-blue-500"
                                        />
                                        <span className="ml-2">Ne</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                                    <FaAd className="mr-1 text-blue-500"/> Povolit reklamy
                                </label>
                                <div className="flex items-center space-x-2 mt-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="hasAds"
                                            checked={form.hasAds}
                                            onChange={() => setForm({...form, hasAds: true})}
                                            className="form-radio h-4 w-4 text-blue-500"
                                        />
                                        <span className="ml-2">Ano</span>
                                    </label>
                                    <label className="inline-flex items-center ml-4">
                                        <input
                                            type="radio"
                                            name="hasAds"
                                            checked={!form.hasAds}
                                            onChange={() => setForm({...form, hasAds: false})}
                                            className="form-radio h-4 w-4 text-blue-500"
                                        />
                                        <span className="ml-2">Ne</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                            <button
                                type="button"
                                onClick={() => setIsAddingCourse(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors order-2 sm:order-1"
                            >
                                Zrušit
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors order-1 sm:order-2"
                            >
                                Vytvořit kurz
                            </button>
                        </div>
                    </form>
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
                            <label htmlFor="edit-title" className="block text-gray-700 text-sm font-medium mb-2">Název
                                kurzu *</label>
                            <input
                                id="edit-title"
                                type="text"
                                placeholder="Název kurzu"
                                value={editForm.title || ""}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="edit-description" className="block text-gray-700 text-sm font-medium mb-2">Popis
                                kurzu</label>
                            <textarea
                                id="edit-description"
                                placeholder="Popis kurzu"
                                value={editForm.description || ""}
                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                            />
                        </div>

                        {/* Add image URL field to edit form */}
                        <div className="mb-4">
                            <label htmlFor="edit-imageUrl"
                                   className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                                <FaImage className="mr-2 text-green-500"/> URL obrázku kurzu
                            </label>
                            <input
                                id="edit-imageUrl"
                                type="text"
                                placeholder="https://example.com/image.jpg"
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
                                    placeholder="Neomezená"
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
                                            name="edit-isPremium"
                                            checked={editForm.isPremium === true}
                                            onChange={() => setEditForm({...editForm, isPremium: true})}
                                            className="form-radio h-4 w-4 text-green-500"
                                        />
                                        <span className="ml-2">Ano</span>
                                    </label>
                                    <label className="inline-flex items-center ml-4">
                                        <input
                                            type="radio"
                                            name="edit-isPremium"
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
                                            name="edit-hasAds"
                                            checked={editForm.hasAds === true}
                                            onChange={() => setEditForm({...editForm, hasAds: true})}
                                            className="form-radio h-4 w-4 text-green-500"
                                        />
                                        <span className="ml-2">Ano</span>
                                    </label>
                                    <label className="inline-flex items-center ml-4">
                                        <input
                                            type="radio"
                                            name="edit-hasAds"
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
                                onClick={() => setEditForm({
                                    id: undefined,
                                    title: "",
                                    description: "",
                                    teacherId: 0,
                                    capacity: null,
                                    isPremium: false,
                                    hasAds: true,
                                    photoUrl: ""
                                })}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors order-2 sm:order-1"
                            >
                                Zrušit
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors order-1 sm:order-2"
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
                        <div key={course.id}
                             className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                            {/* Course image display */}
                            <div className="h-40 overflow-hidden">
                                <img
                                    src={course.photoUrl || "/images/courses/courseone.png"}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                                <div className="flex justify-between items-start">
                                    <h2 className="font-bold text-xl text-gray-800">{course.title}</h2>
                                    {course.isPremium && (
                                        <span
                                            className="bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full text-gray-900">
                                            Premium
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-5">
                                <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]">
                                    {course.description || "Bez popisu"}
                                </p>

                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <FaUserTie className="mr-2 text-blue-500"/>
                                        <span>{course.teacher?.firstName} {course.teacher?.lastName}</span>
                                    </div>

                                    <div className="flex items-center text-gray-500 text-sm">
                                        <FaUsers className="mr-2 text-blue-500"/>
                                        <span>Kapacita: {course.capacity || "∞"}</span>
                                    </div>

                                    <div className="flex items-center text-gray-500 text-sm">
                                        <FaCalendarAlt className="mr-2 text-blue-500"/>
                                        <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-center text-gray-500 text-sm">
                                        <FaAd className="mr-2 text-blue-500"/>
                                        <span>Reklamy: {course.hasAds ? "Ano" : "Ne"}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t flex justify-between items-center">
                                    {canEdit(course.teacherId) ? (
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => setEditForm({
                                                    id: course.id,
                                                    title: course.title,
                                                    description: course.description,
                                                    teacherId: course.teacherId,
                                                    capacity: course.capacity,
                                                    isPremium: course.isPremium,
                                                    hasAds: course.hasAds,
                                                    photoUrl: course.photoUrl
                                                })}
                                                className="text-blue-500 hover:text-blue-700 flex items-center transition-colors"
                                            >
                                                <FaEdit className="mr-1"/>
                                                Upravit
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(course.id)}
                                                className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                                            >
                                                <FaTrash className="mr-1"/>
                                                Smazat
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 text-xs flex items-center">
                                            <FaInfoCircle className="mr-1"/>
                                            Pouze pro tvůrce
                                        </div>
                                    )}

                                    <a href={`/courses/${course.id}`}
                                       className="text-indigo-500 hover:text-indigo-700 text-sm font-medium">
                                        Zobrazit detail →
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-100">
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
                        onClick={() => setIsAddingCourse(true)}
                        className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-colors"
                    >
                        <FaPlus className="mr-2"/>
                        Vytvořit první kurz
                    </button>
                </div>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <div className="flex items-center justify-center text-red-500 mb-4">
                            <FaTrash className="text-3xl"/>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-center">Potvrzení smazání</h3>
                        <p className="mb-6 text-center text-gray-600">
                            Opravdu chcete smazat tento kurz? <br/>
                            <span className="text-red-500 font-medium">Tato akce je nevratná.</span>
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors order-2 sm:order-1"
                            >
                                Zrušit
                            </button>
                            <button
                                onClick={() => handleDeleteCourse(confirmDelete)}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors order-1 sm:order-2"
                            >
                                Smazat kurz
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};