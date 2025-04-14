"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const Pricing = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { data: session } = useSession();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/courses");
                if (!res.ok) {
                    console.log(res.status);
                    toast.error("Chyba při načítání ceníku");
                }

                const data = await res.json();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Neznámá chyba");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);
    const handlePurchase = (plan: string) => {
        if (!session) {
            toast.error("Pro pokračování se musíte přihlásit.");
            return;
        }
        if (plan === "Měsíční plán") {
            window.location.href = "https://buy.stripe.com/test_7sI8yrgZq6aW0JG4gg";
        } else if (plan === "Roční plán") {
            window.location.href = "https://buy.stripe.com/test_3cs7unfVm8j42RO9AB"
        }
    };

    if (loading) {
        return (
            <section id="pricing">
                <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                    <div className="sm:flex justify-between items-center mb-20">
                        <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">Ceník</h2>
                        <Link href={'/pricing'} className="text-primary text-lg font-medium hover:tracking-widest duration-500">Ceník</Link>
                    </div>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="pricing">
                <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                    <div className="sm:flex justify-between items-center mb-20">
                        <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">Ceník</h2>
                        <Link href={'/pricing'} className="text-primary text-lg font-medium hover:tracking-widest duration-500">Ceník</Link>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
                        <p>{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="pricing">
            <div className="container mx-auto mb-48 lg:max-w-screen-xl md:max-w-screen-md grow px-4 pt-10">
                <div className="mb-7">
                    <h1 className="flex items-center text-midnight_text text-4xl lg:text-5xl font-semibold mb-5">
                        Ceník
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Vyberte si plán, který vám nejlépe vyhovuje.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-x-8">
                    {/* Free Trial */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Zkušební verze</h3>
                        <p className="text-gray-600 mb-6">7 dní zdarma</p>
                        <button
                            onClick={() => handlePurchase("Zkušební verze")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Vyzkoušet zdarma
                        </button>
                    </div>
                    {/* Monthly Plan */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Měsíční plán</h3>
                        <p className="text-gray-600 mb-6">250 Kč měsíčně</p>
                        <button
                            onClick={() => handlePurchase("Měsíční plán")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Zakoupit
                        </button>
                    </div>
                    {/* Annual Plan */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Roční plán</h3>
                        <p className="text-gray-600 mb-6">2 500 Kč ročně</p>
                        <button
                            onClick={() => handlePurchase("Roční plán")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Zakoupit
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;