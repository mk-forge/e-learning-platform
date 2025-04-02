"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Course } from "@/types/course";
import { FaUserTie, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const Courses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/courses");
                if (!res.ok) {
                    console.log(res.status);
                    toast.error("Chyba při načítání kurzů");
                }

                const data = await res.json();
                setCourses(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Neznámá chyba");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: Math.min(3, courses.length),
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        speed: 200,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: Math.min(2, courses.length),
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    if (loading) {
        return (
            <section id="courses">
                <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                    <div className="sm:flex justify-between items-center mb-20">
                        <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">Oblíbené kurzy.</h2>
                        <Link href={'/courses'} className="text-primary text-lg font-medium hover:tracking-widest duration-500">Objevte kurzy&nbsp;&gt;&nbsp;</Link>
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
            <section id="courses">
                <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                    <div className="sm:flex justify-between items-center mb-20">
                        <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">Oblíbené kurzy.</h2>
                        <Link href={'/courses'} className="text-primary text-lg font-medium hover:tracking-widest duration-500">Objevte kurzy&nbsp;&gt;&nbsp;</Link>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
                        <p>{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="courses">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <div className="sm:flex justify-between items-center mb-20">
                    <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">Oblíbené kurzy.</h2>
                    <Link href={'/courses'} className="text-primary text-lg font-medium hover:tracking-widest duration-500">Objevte kurzy&nbsp;&gt;&nbsp;</Link>
                </div>
                {courses.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-600">Žádné kurzy nejsou k dispozici.</p>
                    </div>
                ) : (
                    <Slider {...settings}>
                        {courses.map((course) => (
                            <div key={course.id} className="px-2">
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
                                            <h2 className="font-bold text-lg text-gray-800 line-clamp-1">{course.title}</h2>
                                            {course.isPremium && (
                                                <span className="bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full text-gray-900">
                                                    Premium
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                                            {course.description || "Bez popisu"}
                                        </p>

                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <div className="flex items-center text-gray-500 text-xs">
                                                <FaUserTie className="mr-2 text-blue-500"/>
                                                <span className="truncate">{course.teacher?.firstName} {course.teacher?.lastName}</span>
                                            </div>

                                            <div className="flex items-center text-gray-500 text-xs">
                                                <FaCalendarAlt className="mr-2 text-blue-500"/>
                                                <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t flex justify-between items-center">
                                            <div className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 text-xs flex items-center">
                                                <FaInfoCircle className="mr-1"/>
                                                {course.isPremium ? "Premium kurz" : "Základní kurz"}
                                            </div>

                                            <Link
                                                href={`/courses/${course.id}`}
                                                className="text-indigo-500 hover:text-indigo-700 text-sm font-medium"
                                            >
                                                Detail →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                )}
            </div>
        </section>
    );
};

export default Courses;