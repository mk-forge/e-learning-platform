"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import SocialSignIn from "../SocialSignIn";
import Logo from "@/components/Layout/Header/Logo"
import Loader from "@/components/Common/Loader";

const Signin = ({
                    setIsSignInOpen,
                    setIsSignUpOpen
                }: {
    setIsSignInOpen: (open: boolean) => void;
    setIsSignUpOpen: (open: boolean) => void;
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error);
            } else if (result?.ok) {
                toast.success("Login successful");
                setIsSignInOpen(false);
                router.refresh(); // This refreshes the page to update authentication state
            }
        } catch (error) {
            toast.error("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    const switchToSignUp = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSignInOpen(false);
        setIsSignUpOpen(true);
    };

    return (
        <>
            <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
                <Logo />
            </div>

            <SocialSignIn />

            <span className="z-1 relative my-8 block text-center before:content-[''] before:absolute before:h-px before:w-40% before:bg-black/15 before:left-0 before:top-3 after:content-[''] after:absolute after:h-px after:w-40% after:bg-black/15 after:top-3 after:right-0">
        <span className="text-body-secondary relative z-10 inline-block px-3 text-base text-black">
          NEBO
        </span>
      </span>

            <form onSubmit={loginUser}>
                <div className="mb-[22px]">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="w-full rounded-md border border-black/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-black dark:focus:border-primary"
                    />
                </div>

                <div className="mb-[22px]">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="w-full rounded-md border border-black/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-black dark:focus:border-primary"
                    />
                </div>

                <div className="mb-9">
                    <button
                        type="submit"
                        className="bg-primary w-full py-3 rounded-lg text-white text-18 font-medium border border-primary hover:text-primary hover:bg-transparent"
                    >
                        Přihlásit se {loading && <Loader />}
                    </button>
                </div>
            </form>

            <Link
                href="#"
                className="mb-2 inline-block text-base text-dark hover:underline text-primary dark:hover:text-primary"
                onClick={(e) => {
                    e.preventDefault();
                    setIsSignInOpen(false);
                    router.push("/forgot-password");
                }}
            >
                Zapomněli jste heslo?
            </Link>
            <p className="text-body-secondary text-black text-base">
                Ještě nejste členem?{" "}
                <a
                    href="#"
                    className="text-primary hover:underline"
                    onClick={switchToSignUp}
                >
                    Registrovat se
                </a>
            </p>
        </>
    );
};

export default Signin;