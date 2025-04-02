"use client";

import React, {useRef, useState} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaPlus, FaUsers, FaStar, FaAd, FaImage, FaBook } from "react-icons/fa";
import toast from "react-hot-toast";

export default function CreateCoursePage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const router = useRouter();
    const { data: session } = useSession();
    const [form, setForm] = useState({
        title: "",
        description: "",
        teacherId: session?.user?.id ? Number(session.user.id) : 0,
        capacity: null as number | null,
        isPremium: false,
        hasAds: true,
        photoUrl: ""
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    async function uploadFile(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.path;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.title.trim()) {
            toast.error("Název kurzu je povinný");
            return;
        }

        try {
            let photoUrl = form.photoUrl;

            if (selectedFile) {
                const uploadedPath = await uploadFile(selectedFile);
                photoUrl = uploadedPath;
            }

            const response = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    photoUrl
                }),
            });

            if (!response.ok) {
                throw new Error("Nepodařilo se přidat kurz");
            }

            toast.success("Kurz byl úspěšně přidán");
            router.push("/courseManagement");
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

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-blue-500">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">
                            Název kurzu *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({...form, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
                            Popis kurzu
                        </label>
                        <textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => setForm({...form, description: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                            <FaImage className="mr-2 text-blue-500"/> Obrázek kurzu
                        </label>
                        <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                                required
                            />

                            {previewUrl ? (
                                <div className="relative w-full max-w-md">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setPreviewUrl("");
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center space-y-2 cursor-pointer"
                                >
                                    <FaImage className="text-4xl text-gray-400"/>
                                    <span className="text-gray-600">Klikněte pro nahrání obrázku</span>
                                    <span className="text-xs text-gray-500">nebo přetáhněte soubor sem</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label htmlFor="capacity" className="block text-gray-700 text-sm font-medium mb-2">
                                <FaUsers className="inline mr-1 text-blue-500"/> Kapacita
                            </label>
                            <input
                                id="capacity"
                                type="number"
                                min="1"
                                value={form.capacity || ''}
                                required
                                onChange={(e) => setForm({
                                    ...form,
                                    capacity: e.target.value ? Number(e.target.value) : null
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                                <FaStar className="mr-1 text-blue-500"/> Premium kurz
                            </label>
                            <div className="flex items-center space-x-2 mt-2">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={form.isPremium}
                                        onChange={() => setForm({...form, isPremium: true})}
                                        className="form-radio h-4 w-4 text-blue-500"
                                    />
                                    <span className="ml-2">Ano</span>
                                </label>
                                <label className="inline-flex items-center ml-4">
                                    <input
                                        type="radio"
                                        checked={!form.isPremium}
                                        onChange={() => setForm({...form, isPremium: false})}
                                        className="form-radio h-4 w-4 text-blue-500"
                                    />
                                    <span className="ml-2">Ne</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                                <FaAd className="mr-1 text-blue-500"/> Povolit reklamy
                            </label>
                            <div className="flex items-center space-x-2 mt-2">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={form.hasAds}
                                        onChange={() => setForm({...form, hasAds: true})}
                                        className="form-radio h-4 w-4 text-blue-500"
                                    />
                                    <span className="ml-2">Ano</span>
                                </label>
                                <label className="inline-flex items-center ml-4">
                                    <input
                                        type="radio"
                                        checked={!form.hasAds}
                                        onChange={() => setForm({...form, hasAds: false})}
                                        className="form-radio h-4 w-4 text-blue-500"
                                    />
                                    <span className="ml-2">Ne</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Zrušit
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <FaPlus className="inline mr-2"/>
                            Vytvořit kurz
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}