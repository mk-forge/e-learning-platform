"use client";

import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import toast from "react-hot-toast";
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
                router.refresh();
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
            <div className="mb-5 text-center mx-auto inline-block max-w-[160px]">
                <Logo/>
            </div>

            <div className="relative my-8 flex items-center justify-center">
                <div className="absolute left-0 top-1/2 h-px w-[40%] bg-black/15"></div>
                <span className="relative z-10 inline-block px-4 text-base font-medium text-black/70">
                    Sign In
                </span>
                <div className="absolute right-0 top-1/2 h-px w-[40%] bg-black/15"></div>
            </div>

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

                <div className="mb-5">
                    <button
                        type="submit"
                        className="bg-primary w-full py-3 rounded-lg text-white text-18 font-medium border border-primary hover:text-primary hover:bg-transparent"
                    >
                        Přihlásit se {loading && <Loader/>}
                    </button>
                </div>
            </form>
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