"use client"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    photoUrl: string | null;
    role: string;
}

const Mentor = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeachers() {
            try {
                const res = await fetch("/api/teachers");
                if (!res.ok) throw new Error("Failed to fetch teachers");
                const data = await res.json();
                setTeachers(data);
            } catch (error) {
                console.error("Error fetching teachers:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchTeachers();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 530,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    if (loading) {
        return (
            <section className="bg-deepSlate">
                <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 py-20 relative">
                    <h2 className="text-midnight_text text-5xl font-semibold mb-10">Setkejte se se svým <br /> mentorem.</h2>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-deepSlate" id="mentor" >
            <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 relative'>
                <h2 className="text-midnight_text text-5xl font-semibold">Setkejte se se svým <br /> mentorem.</h2>

                <Slider {...settings}>
                    {teachers.map((teacher) => (
                        <div key={teacher.id}>
                            <div className='m-3 py-14 md:my-10 text-center'>
                                <div className="relative">
                                    <Image
                                        src={teacher.photoUrl || "/images/mentor/user1.png"}
                                        alt={`${teacher.firstName} ${teacher.lastName}`}
                                        width={306}
                                        height={300}
                                        className="inline-block m-auto h-[300px] object-cover"
                                    />
                                    <div className="absolute right-[84px] bottom-[102px] bg-white rounded-full p-4">
                                        <Image src={'/images/mentor/linkedin.svg'} alt="linkedin-image" width={25} height={24} />
                                    </div>
                                </div>
                                <div className="-mt-10">
                                    <h3 className='text-2xl font-semibold text-lightblack'>{teacher.firstName} {teacher.lastName}</h3>
                                    <h4 className='text-lg font-normal text-lightblack pt-2 opacity-50'>Učitel</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}

export default Mentor