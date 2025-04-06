"use client";

import React, {useRef, useState} from "react";
import {FaSpinner, FaTrash, FaUpload} from "react-icons/fa";
import toast from "react-hot-toast";

interface VideoUploadProps {
    onVideoUrlChange: (url: string) => void;
}

export const VideoUpload = ({onVideoUrlChange}: VideoUploadProps) => {
    const [uploadType, setUploadType] = useState<'url' | 'file'>('file');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string>("");

    async function handleFileUpload(file: File) {
        setIsUploading(true);
        setUploadError("");
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload-video', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error || response.statusText;
                setUploadError(`Chyba při nahrávání: ${errorMessage}`);
                toast.error('Nahrávání selhalo. Zkuste to znovu.');
                return;
            }

            const data = await response.json();
            setVideoUrl(data.path);
            onVideoUrlChange(data.path);
            toast.success('Video bylo úspěšně nahráno');
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError('Chyba při nahrávání videa');
            toast.error('Nahrávání selhalo. Zkuste to znovu.');
        } finally {
            setIsUploading(false);
        }
    }

    const handleUrlChange = (url: string) => {
        setVideoUrl(url);
        onVideoUrlChange(url);
    }

    const handleRemoveVideo = () => {
        setVideoUrl("");
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onVideoUrlChange("");
        toast.success('Video bylo odstraněno');
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
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <FaSpinner className="text-3xl mb-2 text-blue-500 animate-spin"/>
                            <span>Nahrávání videa...</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center w-full"
                            disabled={isUploading}
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
                    )}

                    {uploadError && (
                        <div className="mt-2 text-red-500 text-sm">
                            {uploadError}
                        </div>
                    )}
                </div>
            ) : (
                <input
                    type="url"
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://..."
                />
            )}

            {videoUrl && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-700 text-sm font-medium">Video náhled</h3>
                        <button
                            onClick={handleRemoveVideo}
                            className="text-red-500 hover:text-red-700 flex items-center"
                        >
                            <FaTrash className="mr-1"/> Odstranit
                        </button>
                    </div>
                    <video
                        src={videoUrl.startsWith('http') ? videoUrl : `${videoUrl}`}
                        controls
                        className="w-full rounded-lg border border-gray-300"
                        style={{maxHeight: '300px'}}
                    />
                </div>
            )}
        </div>
    );
};