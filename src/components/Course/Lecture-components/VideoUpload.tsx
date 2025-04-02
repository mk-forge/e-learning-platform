"use client";

import React, {useRef, useState} from "react";
import {FaUpload} from "react-icons/fa";
import toast from "react-hot-toast";

interface VideoUploadProps {
    onVideoUrlChange: (url: string) => void;
    onDescriptionChange: (desc: string) => void;
}

export const VideoUpload = ({onVideoUrlChange}: VideoUploadProps) => {
    const [uploadType, setUploadType] = useState<'url' | 'file'>('file');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    async function handleFileUpload(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/upload-video', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.log('Upload failed:', response.statusText);
                toast.error('Upload failed. Please try again.');
            }

            const data = await response.json();
            onVideoUrlChange(data.path);
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Upload failed. Please try again.');
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex space-x-4 mb-4">
                <button
                    type="button"
                    onClick={() => setUploadType('file')}
                    className={`px-4 py-2 rounded-lg ${
                        uploadType === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Nahrát soubor
                </button>
                <button
                    type="button"
                    onClick={() => setUploadType('url')}
                    className={`px-4 py-2 rounded-lg ${
                        uploadType === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Video URL
                </button>
            </div>

            {uploadType === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setSelectedFile(file);
                                handleFileUpload(file);
                            }
                        }}
                        accept="video/*"
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center w-full"
                    >
                        <FaUpload className="text-3xl mb-2 text-gray-400"/>
                        {selectedFile ? (
                            <span>{selectedFile.name}</span>
                        ) : (
                            <>
                                <span>Klikněte pro nahrání videa</span>
                                <span className="text-sm text-gray-500">nebo přetáhněte soubor sem</span>
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <input
                    type="url"
                    onChange={(e) => onVideoUrlChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://..."
                />
            )}
        </div>
    );
};