"use client";

import React from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {FaUser, FaEnvelope, FaUserTag, FaGraduationCap, FaBook} from "react-icons/fa";
import {useEffect, useState} from "react";

const ProfilePage = () => {
    const {data: session, status} = useSession();
    const router = useRouter();

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    <p className="font-medium">Přístup odepřen. Nejste přihlášeni.</p>
                </div>
            </div>
        );
    }

    const user = session?.user;
    const isStudent = user?.role === "student";

    // Redirect teachers to their dedicated page
    if (user?.role === "teacher") {
        router.push("/teacher");
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-10">
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
                    <UserProfileComponent/>
                </div>
            )}
        </div>
    );
};

// This component only renders the enrolled courses section from UserProfile
const UserProfileComponent = () => {
    const {data: session} = useSession();
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
                if (!res.ok) throw new Error("Nepodařilo se načíst data uživatele");
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userData.enrollments.map((enrollment: any) => (
                                <div key={enrollment.id}
                                     className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <h3 className="font-medium">{enrollment.course.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Zapsáno: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                    </p>
                                    <a
                                        href={`/courses/${enrollment.course.id}`}
                                        className="text-blue-500 hover:text-blue-700 text-sm flex items-center mt-2"
                                    >
                                        Přejít na kurz →
                                    </a>
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

export default ProfilePage;