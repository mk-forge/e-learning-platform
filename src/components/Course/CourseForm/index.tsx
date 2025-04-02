"use client";

import React, {useRef, useState} from "react";
import {Course} from "@/types/course";
import {FaPlus, FaUsers, FaStar, FaAd, FaImage, FaSave} from "react-icons/fa";
import toast from "react-hot-toast";

interface CourseFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<Course>;
    onSubmit: (data: Partial<Course> & { file?: File }, p: File | undefined) => void;
    onCancel: () => void;
}

export const CourseForm = ({mode, initialData, onSubmit, onCancel}: CourseFormProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialData?.photoUrl || "");
    const [form, setForm] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        teacherId: initialData?.teacherId || 0,
        capacity: initialData?.capacity || null,
        isPremium: initialData?.isPremium || false,
        hasAds: initialData?.hasAds ?? true,
        photoUrl: initialData?.photoUrl || ""
    });

    const [formErrors, setFormErrors] = useState({
        title: false,
        description: false,
        photoUrl: false,
        capacity: false
    })

    const validateForm = () => {
        const errors = {
            title: !form.title.trim(),
            description: !form.description.trim(),
            photoUrl: !previewUrl,
            capacity: !form.capacity || form.capacity <= 0
        };
        setFormErrors(errors);
        return !Object.values(errors).some((error) => error);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Vyplňte všechna povinná pole");
            return;
        }

        onSubmit(form, selectedFile || undefined);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
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
                {formErrors.title && <p className="text-red-500 text-sm mt-1">Název kurzu je povinný</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
                    Popis kurzu *
                </label>
                <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                />
                {formErrors.description && <p className="text-red-500 text-sm mt-1">Popis kurzu je povinný</p>}
            </div>

            <div className="mb-4">
                <label className="text-gray-700 text-sm font-medium mb-2 flex items-center">
                    <FaImage className="mr-2 text-blue-500"/> Obrázek kurzu *
                </label>
                <div
                    className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    {formErrors.title && <p className="text-red-500 text-sm mt-1">Obrazek kurzu je povinný</p>}


                    {previewUrl ? (
                        <div className="relative w-full aspect-video">
                            <img
                                src={previewUrl}
                                alt="Náhled"
                                className="w-full h-full object-cover rounded-lg"
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
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
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
                        <FaUsers className="inline mr-1 text-blue-500"/> Kapacita *
                    </label>
                    <input
                        id="capacity"
                        type="number"
                        min="1"
                        value={form.capacity || ''}
                        onChange={(e) => setForm({
                            ...form,
                            capacity: e.target.value ? Number(e.target.value) : null
                        })}
                        className={`w-full px-3 py-2 border rounded-lg ${
                            formErrors.capacity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                    {formErrors.capacity && (
                        <p className="text-red-500 text-sm mt-1">
                            Zadejte platnou kapacitu kurzu
                        </p>
                    )}
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
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Zrušit
                </button>
                <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-lg transition-colors ${
                        mode === 'edit'
                            ? 'bg-amber-500 hover:bg-amber-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {mode === 'create' ? (
                        <>
                            <FaPlus className="inline mr-2"/>
                            Vytvořit kurz
                        </>
                    ) : (
                        <>
                            <FaSave className="inline mr-2"/>
                            Uložit změny
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};