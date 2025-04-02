"use client";

import React from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface TextEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export const TextEditor = ({ value, onChange }: TextEditorProps) => {
    return (
        <div className="min-h-[200px] mb-12">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                className="h-64"
                modules={{
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                    ]
                }}
            />
        </div>
    );
};