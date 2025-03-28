"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Course } from "@/types/course";

// Array of course images for random selection
const courseImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyIxiE33bx2t0rTEUln1KrEc7e4TejvtOZPg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPHX0QdVpZVWsnXCaEF3Lp7bSmZ7MIkjL33A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOAnih04WNhAAe_aolZqky1alLD72EIoEDEA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ28e3mGOO58W9ZYK77RnRWft95Bwr4lg5RQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1QcWyLr7f0bHiBv4ZKw74dpj5sfS98yJPA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuiNAv3RuXflh4VDsij9Onm3Ii7CuQbFJsTQ&s"
];

const Courses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/courses");
                if (!res.ok) throw new Error("Chyba při načítání kurzů");
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
        speed: 500,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: Math.min(2, courses.length),
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    // Random rating for demo purposes
    const generateRating = () => {
        return (Math.floor(Math.random() * 10) + 35) / 10; // Rating between 3.5 and 5.0
    };

    // Random price for demo purposes
    const generatePrice = () => {
        return Math.floor(Math.random() * 50) + 30; // Price between $30 and $80
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;

        return (
            <>
                {[...Array(fullStars)].map((_, i) => (
                    <Icon key={`full-${i}`} icon="tabler:star-filled" className="text-yellow-500 text-xl inline-block" />
                ))}
                {halfStars > 0 && <Icon key="half" icon="tabler:star-half-filled" className="text-yellow-500 text-xl inline-block" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Icon key={`empty-${i}`} icon="tabler:star-filled" className="text-gray-400 text-xl inline-block" />
                ))}
            </>
        );
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
                        {courses.map((course, index) => {
                            const rating = generateRating();
                            const price = generatePrice();
                            const imgSrc = courseImages[index % courseImages.length];

                            return (
                                <div key={course.id}>
                                    <div className="bg-white m-3 mb-12 px-3 pt-3 pb-12 shadow-course-shadow rounded-2xl h-full">
                                        <div className="relative rounded-3xl overflow-hidden h-[200px]">
                                            <img
                                                src={imgSrc}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {course.isPremium && (
                                                <div className="absolute right-5 -bottom-2 bg-secondary rounded-full p-4">
                                                    <h3 className="text-white uppercase text-center text-xs font-medium">premium</h3>
                                                </div>
                                            )}
                                        </div>

                                        <div className="px-3 pt-6">
                                            <Link href={`/courses/${course.id}`} className="text-2xl font-bold text-black max-w-75% inline-block">{course.title}</Link>
                                            <h3 className="text-base font-normal pt-6 text-black/75">{course.teacher.firstName} {course.teacher.lastName}</h3>
                                            <div className="flex justify-between items-center py-6 border-b">
                                                <div className="flex items-center gap-4">
                                                    <h3 className="text-red-700 text-2xl font-medium">{rating.toFixed(1)}</h3>
                                                    <div className="flex">
                                                        {renderStars(rating)}
                                                    </div>
                                                </div>
                                                {course.isPremium ? (
                                                    <h3 className="text-3xl font-medium">${price}</h3>
                                                ) : (
                                                    <h3 className="text-2xl font-medium text-green-600">Zdarma</h3>
                                                )}
                                            </div>
                                            <div className="flex justify-between pt-6">
                                                <div className="flex gap-4">
                                                    <Icon
                                                        icon="solar:notebook-minimalistic-outline"
                                                        className="text-primary text-xl inline-block me-2"
                                                    />
                                                    <h3 className="text-base font-medium text-black opacity-75">
                                                        {course.materials?.length || 0} materiálů
                                                    </h3>
                                                </div>
                                                <div className="flex gap-4">
                                                    <Icon
                                                        icon="solar:users-group-rounded-linear"
                                                        className="text-primary text-xl inline-block me-2"
                                                    />
                                                    <h3 className="text-base font-medium text-black opacity-75">
                                                        {course.capacity || "∞"} studentů
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                )}
            </div>
        </section>
    );
};

export default Courses;