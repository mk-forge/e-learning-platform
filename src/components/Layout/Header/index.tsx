"use client";

import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";
import {headerData} from "../Header/Navigation/menuData";
import Logo from "./Logo";
import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import SignUp from "@/components/Auth/SignUp";
import SignIn from "@/components/Auth/SignIn";
import {Icon} from "@iconify/react/dist/iconify.js";
import {useSession, signOut} from "next-auth/react";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";

const Header: React.FC = () => {
    const {data: session} = useSession();
    const router = useRouter();

    const [navbarOpen, setNavbarOpen] = useState(false);
    const [sticky, setSticky] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const signInRef = useRef<HTMLDivElement>(null);
    const signUpRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        setSticky(window.scrollY >= 80);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            signInRef.current &&
            !signInRef.current.contains(event.target as Node)
        ) {
            setIsSignInOpen(false);
        }
        if (
            signUpRef.current &&
            !signUpRef.current.contains(event.target as Node)
        ) {
            setIsSignUpOpen(false);
        }
        if (
            mobileMenuRef.current &&
            !mobileMenuRef.current.contains(event.target as Node) &&
            navbarOpen
        ) {
            setNavbarOpen(false);
        }
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    const handleLogout = async () => {
        await signOut({redirect: false});
        toast.success("Successfully logged out");
        router.push("/");
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [navbarOpen, isSignInOpen, isSignUpOpen, dropdownOpen]);

    useEffect(() => {
        if (isSignInOpen || isSignUpOpen || navbarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isSignInOpen, isSignUpOpen, navbarOpen]);

    return (
        <header
            className={`fixed top-0 z-40 w-full pb-5 transition-all duration-300 bg-white ${
                sticky ? " shadow-lg py-5" : "shadow-none py-6"
            }`}
        >
            <div className="lg:py-0 py-2">
                <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
                    <Logo />
                    <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
                        {headerData.map((item, index) => (
                            <HeaderLink key={index} item={item} />
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        {session?.user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    className="flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-lg font-medium"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <span>
                                        {session.user.firstName
                                            ? `${session.user.firstName} ${session.user.lastName}`
                                            : session.user.firstName}
                                    </span>
                                    <Icon icon="tabler:chevron-down" className="text-primary" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            href="/profile"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (session?.user?.role === "teacher") {
                                                    router.push("/teacher");
                                                } else {
                                                    router.push("/profile");
                                                }
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profil
                                        </Link>
                                        {/*<Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">*/}
                                        {/*    Dashboard*/}
                                        {/*</Link>*/}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Odhlásit se
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="#"
                                    className="hidden lg:block bg-primary text-white hover:bg-primary/15 hover:text-primary px-16 py-5 rounded-full text-lg font-medium"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsSignInOpen(true);
                                    }}
                                >
                                    Přihlásit se
                                </Link>
                                <Link
                                    href="#"
                                    className="hidden lg:block bg-primary/15 hover:bg-primary text-primary hover:text-white px-16 py-5 rounded-full text-lg font-medium"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsSignUpOpen(true);
                                    }}
                                >
                                    Registrovat se
                                </Link>
                            </>
                        )}

                        {/* SignIn Modal */}
                        {isSignInOpen && (
                            <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                                <div
                                    ref={signInRef}
                                    className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white backdrop-blur-md px-8 pt-14 pb-8 text-center"
                                >
                                    <button
                                        onClick={() => setIsSignInOpen(false)}
                                        className="absolute top-0 right-0 mr-8 mt-8 dark:invert"
                                        aria-label="Close Sign In Modal"
                                    >
                                        <Icon
                                            icon="tabler:currency-xrp"
                                            className="text-black hover:text-primary text-24 inline-block me-2"
                                        />
                                    </button>
                                    <SignIn
                                        setIsSignInOpen={setIsSignInOpen}
                                        setIsSignUpOpen={setIsSignUpOpen}
                                    />
                                </div>
                            </div>
                        )}

                        {/* SignUp Modal */}
                        {isSignUpOpen && (
                            <div
                                className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                                <div
                                    ref={signUpRef}
                                    className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white backdrop-blur-md px-8 pt-14 pb-8 text-center"
                                >
                                    <button
                                        onClick={() => setIsSignUpOpen(false)}
                                        className="absolute top-0 right-0 mr-8 mt-8 dark:invert"
                                        aria-label="Close Sign Up Modal"
                                    >
                                        <Icon
                                            icon="tabler:currency-xrp"
                                            className="text-black hover:text-primary text-24 inline-block me-2"
                                        />
                                    </button>
                                    <SignUp
                                        setIsSignInOpen={setIsSignInOpen}
                                        setIsSignUpOpen={setIsSignUpOpen}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setNavbarOpen(!navbarOpen)}
                            className="block lg:hidden p-2 rounded-lg"
                            aria-label="Toggle mobile menu"
                        >
                            <span className="block w-6 h-0.5 bg-white"></span>
                            <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
                            <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
                        </button>
                    </div>
                </div>

                {navbarOpen && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"/>
                )}
                <div
                    ref={mobileMenuRef}
                    className={`lg:hidden fixed top-0 right-0 h-full w-full bg-darkmode shadow-lg transform transition-transform duration-300 max-w-xs ${
                        navbarOpen ? "translate-x-0" : "translate-x-full"
                    } z-50`}
                >
                    <div className="flex items-center justify-between p-4">
                        <h2 className="text-lg font-bold text-midnight_text dark:text-midnight_text">
                            <Logo/>
                        </h2>

                        <button
                            onClick={() => setNavbarOpen(false)}
                            className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5 absolute top-0 right-0 mr-8 mt-8 dark:invert"
                            aria-label="Close menu Modal"
                        ></button>
                    </div>
                    <nav className="flex flex-col items-start p-4">
                        {headerData.map((item, index) => (
                            <MobileHeaderLink key={index} item={item}/>
                        ))}
                        {!session?.user && (
                            <div className="mt-4 flex flex-col space-y-4 w-full">
                                <Link
                                    href="#"
                                    className="bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsSignInOpen(true);
                                        setNavbarOpen(false);
                                    }}
                                >
                                    Přihlásit se
                                </Link>
                                <Link
                                    href="#"
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsSignUpOpen(true);
                                        setNavbarOpen(false);
                                    }}
                                >
                                    Registrovat se
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;