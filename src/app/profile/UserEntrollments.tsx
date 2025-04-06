"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaBook } from "react-icons/fa";
import toast from "react-hot-toast";

export const UserEnrollments = () => {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/users/${session.user.email}`);
                if (!res.ok) {
                    console.log(res.status);
                    toast.error("Nepodařilo se načíst data uživatele");
                }
                const data = await res.json();
                setUserData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Neznámá chyba");
            } finally {
                setLoading(false);
            }
        };

        if (session?.user) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [session]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {userData?.role === "student" && userData?.enrollments && (
                <div className="p-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <FaBook className="mr-2 text-blue-500"/>
                        Zapsané kurzy
                    </h2>
                    {userData.enrollments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {userData.enrollments.map((enrollment: any) => (
                                <div key={enrollment.id}
                                     className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-40 overflow-hidden">
                                        <img
                                            src={enrollment.course.photoUrl || "/images/courses/courseone.png"}
                                            alt={enrollment.course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium">{enrollment.course.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {enrollment.course.description || "Bez popisu"}
                                        </p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                                {enrollment.course.isPremium ? "Premium" : "Free"}
                                            </span>
                                            <a
                                                href={`/courses/${enrollment.course.id}`}
                                                className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                                            >
                                                Přejít na kurz →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Nejste zapsáni v žádném kurzu.</p>
                    )}
                </div>
            )}
        </div>
    );
};