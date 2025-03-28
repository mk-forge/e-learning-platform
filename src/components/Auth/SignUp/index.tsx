"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import SocialSignUp from "../SocialSignUp";
import Logo from "@/components/Layout/Header/Logo";
import React, { useState } from "react";
import Loader from "@/components/Common/Loader";
import { registerUser } from "@/app/actions/auth";

const SignUp = ({
                    setIsSignInOpen,
                    setIsSignUpOpen
                }: {
    setIsSignInOpen: (open: boolean) => void;
    setIsSignUpOpen: (open: boolean) => void;
}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await registerUser(formData);

            if (result.success) {
                toast.success("Successfully registered");

                // Auto-login after registration
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;

                const loginResult = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (loginResult?.ok) {
                    setIsSignUpOpen(false);
                    router.refresh(); // Refresh to update authentication state
                } else if (loginResult?.error) {
                    toast.error("Registration successful but couldn't log in automatically");
                }
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred during registration. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const switchToSignIn = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
    };

    return (
        <>
            <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
                <Logo/>
            </div>

            <SocialSignUp/>

            <span
                className="z-1 relative my-8 block text-center before:content-[''] before:absolute before:h-px before:w-40% before:bg-black/60 before:left-0 before:top-3 after:content-[''] after:absolute after:h-px after:w-40% after:bg-black/60 after:top-3 after:right-0">
        <span className="relative z-10 inline-block px-3 text-base text-black">
          OR
        </span>
      </span>

            <form onSubmit={handleSubmit}>
                <div className="mb-[22px] flex gap-2">
                    <input
                        type="text"
                        placeholder="Jméno"
                        name="firstName"
                        required
                        className="w-full rounded-md border border-black/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-black dark:focus:border-primary"
                    />
                    <input
                        type="text"
                        placeholder="Příjmení"
                        name="lastName"
                        required
                        className="w-full rounded-md border border-black/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-black dark:focus:border-primary"
                    />
                </div>
                <div className="mb-[22px]">
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        required
                        className="w-full rounded-md border border-black/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-black dark:focus:border-primary"
                    />
                </div>
                <div className="mb-[22px]">
                    <input
                        type="password"
                        placeholder="Heslo"
                        name="password"
                        required
                        className="w-full rounded-md border border-black/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-black dark:focus:border-primary"
                    />
                </div>
                <div className="mb-9">
                    <button
                        type="submit"
                        className="flex w-full items-center text-18 font-medium justify-center rounded-md text-white bg-primary px-5 py-3 text-darkmode transition duration-300 ease-in-out hover:bg-transparent hover:text-primary border-primary border "
                    >
                        Registrovat se {loading && <Loader/>}
                    </button>
                </div>
            </form>

            <p className="text-body-secondary text-black text-base">
                Už máte účet?
                <a href="#" className="pl-2 text-primary hover:underline" onClick={switchToSignIn}>
                    Přihlásit se
                </a>
            </p>
        </>
    );
};

export default SignUp;