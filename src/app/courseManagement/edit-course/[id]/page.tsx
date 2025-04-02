"use client";

import {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {FaBook} from "react-icons/fa";
import {CourseForm} from "@/components/Course/CourseForm";
import {AddLecture} from "@/components/Course/AddLecture";
import toast from "react-hot-toast";
import {Course} from "@/types/course";

export default function EditCoursePage({params}: { params: { id: string } }) {
    const router = useRouter();
    const {data: session} = useSession();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourse();
    }, [params.id]);

    async function fetchCourse() {
        try {
            const response = await fetch(`/api/courses/${params.id}`);
            if (!response.ok) {
                console.log("Error fetching course:", response.statusText);
                toast.error("Kurz nebyl nalezen");
                return;
            }

            const data = await response.json();
            setCourse(data);
        } catch (err) {
            toast.error("Nepodařilo se načíst kurz");
            router.push("/courseManagement");
        } finally {
            setLoading(false);
        }
    }

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

    async function handleCourseSubmit(data: Partial<Course> & { file?: File }) {
        try {
            let photoUrl = data.photoUrl;
            if (data.file) {
                photoUrl = await uploadFile(data.file);
            }

            const response = await fetch(`/api/courses/${params.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...data,
                    photoUrl,
                    teacherId: session?.user?.id ? Number(session.user.id) : 0,
                }),
            });

            if (!response.ok) {
                console.log("Error updating course:", response.statusText);
                toast.error("Nepodařilo se upravit kurz");
                return;
            }

            toast.success("Kurz byl úspěšně upraven");
            router.push("/courseManagement");
        } catch (err) {
            toast.error("Nepodařilo se upravit kurz");
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }

    if (!course) return null;

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-6">
                <FaBook className="mr-3 text-blue-500"/>
                Upravit kurz
            </h1>

            <div className="grid grid-cols-1 gap-8">
                <CourseForm
                    mode="edit"
                    initialData={course}
                    onSubmit={handleCourseSubmit}
                    onCancel={() => router.back()}
                />

                <AddLecture
                    courseId={Number(params.id)}
                    onComplete={() => router.push("/courseManagement")}
                />
            </div>
        </div>
    );
}