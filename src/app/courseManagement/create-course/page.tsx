"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaBook } from "react-icons/fa";
import { CourseForm } from "@/components/Course/CourseForm";
import { AddLecture } from "@/components/Course/AddLecture";
import toast from "react-hot-toast";

export default function CreateCoursePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [courseId, setCourseId] = useState<number | null>(null);

    async function uploadFile(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        return data.path;
    }

    async function handleCourseSubmit(formData: any, file?: File) {
        try {
            let photoUrl = formData.photoUrl;
            if (file) {
                photoUrl = await uploadFile(file);
            }

            const response = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    photoUrl,
                    teacherId: session?.user?.id ? Number(session.user.id) : 0,
                }),
            });

            if (!response.ok) {
                toast.error("Nepodařilo se přidat kurz");
                return;
            }

            const course = await response.json();
            setCourseId(course.id);
            toast.success("Kurz byl úspěšně vytvořen");
        } catch (err) {
            toast.error("Nepodařilo se přidat kurz");
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-6">
                <FaBook className="mr-3 text-blue-500"/>
                Vytvořit nový kurz
            </h1>

            <div className="grid grid-cols-1 gap-8">
                {!courseId ? (
                    <CourseForm
                        mode="create"
                        onSubmit={handleCourseSubmit}
                        onCancel={() => router.back()}
                    />
                ) : (
                    <AddLecture
                        courseId={courseId}
                        onComplete={() => router.push("/courseManagement")}
                    />
                )}
            </div>
        </div>
    );
}