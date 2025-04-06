"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaUserTag, FaGraduationCap } from "react-icons/fa";
import { UserEnrollments } from "./UserEntrollments"

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/");
        return null;
    }

    const user = session?.user;
    const isStudent = user?.role === "student";

    return (
        <div className="container mx-auto px-4 py-10 mt-20">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FaGraduationCap className="mr-3 text-blue-500"/>
                Profil uživatele
            </h1>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="bg-white rounded-full p-4 shadow-md">
                            <FaGraduationCap className="text-5xl text-blue-500"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
                            <p className="text-blue-100 capitalize font-medium">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-1 text-gray-500">
                                <FaUser className="mr-2"/>
                                <span className="text-sm font-medium">Jméno</span>
                            </div>
                            <p className="text-gray-700 font-medium pl-6">{user?.firstName} {user?.lastName}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-1 text-gray-500">
                                <FaEnvelope className="mr-2"/>
                                <span className="text-sm font-medium">E-mail</span>
                            </div>
                            <p className="text-gray-700 font-medium pl-6">{user?.email}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-1 text-gray-500">
                                <FaUserTag className="mr-2"/>
                                <span className="text-sm font-medium">Role</span>
                            </div>
                            <p className="text-gray-700 capitalize font-medium pl-6">{user?.role}</p>
                        </div>

                        {isStudent && (
                            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                                <button
                                    onClick={() => router.push("/courses")}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Procházet kurzy
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isStudent && (
                <div className="mt-6">
                    <UserEnrollments />
                </div>
            )}
        </div>
    );
};

export default ProfilePage;