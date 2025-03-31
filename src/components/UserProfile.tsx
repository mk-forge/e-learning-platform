"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUser,FaEdit, FaCheckCircle } from "react-icons/fa";

export const UserProfile = () => {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });

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
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email
                });
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

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.email) return;

        try {
            setUserData({
                ...userData,
                ...formData
            });
            setEditMode(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Neznámá chyba");
        }
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

    if (!session?.user) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-700">Pro zobrazení profilu se musíte přihlásit.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 px-8">
                    <div className="flex items-center">
                        <div className="rounded-full bg-white p-3 mr-4">
                            <FaUser className="text-blue-500 text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-white text-2xl font-bold">{userData?.firstName} {userData?.lastName}</h1>
                            <p className="text-blue-100">{userData?.email}</p>
                            <p className="text-blue-100 capitalize mt-1">Role: {userData?.role}</p>
                        </div>
                        {!editMode && (
                            <button
                                onClick={handleEditToggle}
                                className="ml-auto bg-white text-blue-500 px-4 py-2 rounded-lg flex items-center"
                            >
                                <FaEdit className="mr-2" />
                                Upravit profil
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {editMode ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Jméno
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Příjmení
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                                >
                                    <FaCheckCircle className="mr-2" />
                                    Uložit změny
                                </button>
                                <button
                                    type="button"
                                    onClick={handleEditToggle}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                >
                                    Zrušit
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold mb-6 flex items-center">
                                <FaUser className="mr-2 text-blue-500" />
                                Informace o uživateli
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Jméno</h3>
                                    <p className="mt-1 text-lg">{userData?.firstName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Příjmení</h3>
                                    <p className="mt-1 text-lg">{userData?.lastName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                    <p className="mt-1 text-lg">{userData?.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                                    <p className="mt-1 text-lg capitalize">{userData?.role}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;