import React from "react";
import { Course } from "@/types/course";
import { FaUserTie, FaUsers, FaCalendarAlt, FaAd, FaInfoCircle, FaTrash, FaEdit } from "react-icons/fa";

interface CourseCardProps {
    course: Course;
    isTeacher?: boolean;
    onEdit?: (course: Course) => void;
    onDelete?: (courseId: number) => void;
}

export const CourseCard = ({ course, isTeacher = false, onEdit, onDelete }: CourseCardProps) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
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
                        <span className="bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full text-gray-900">
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
                    {isTeacher ? (
                        <div className="flex space-x-3">
                            <button
                                onClick={() => onEdit?.(course)}
                                className="text-blue-500 hover:text-blue-700 flex items-center transition-colors"
                            >
                                <FaEdit className="mr-1"/>
                                Upravit
                            </button>
                            <button
                                onClick={() => onDelete?.(course.id)}
                                className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                            >
                                <FaTrash className="mr-1"/>
                                Smazat
                            </button>
                        </div>
                    ) : (
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 text-xs flex items-center">
                            <FaInfoCircle className="mr-1"/>
                            {course.isPremium ? "Premium kurz" : "Základní kurz"}
                        </div>
                    )}

                    <a href={`/courses/${course.id}`}
                       className="text-indigo-500 hover:text-indigo-700 text-sm font-medium">
                        Zobrazit detail →
                    </a>
                </div>
            </div>
        </div>
    );
};