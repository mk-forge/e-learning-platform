import {Poppins} from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import {ThemeProvider} from "next-themes";
import ScrollToTop from "@/components/ScrollToTop";
import React from "react";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from "react-hot-toast";

const font = Poppins({subsets: ["latin"], weight: ["400", "500", "600", "700"],});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="cs" suppressHydrationWarning>
        <body className={`${font.className}`}>
        <NextAuthSessionProvider>
            <ThemeProvider
                attribute="class"
                enableSystem={true}
                defaultTheme="light"
            >
                <Header/>
                {children}
                <Footer/>
                <ScrollToTop/>
                <Toaster position="top-center" />
            </ThemeProvider>
        </NextAuthSessionProvider>
        </body>
        </html>
    );
}