"use client";

import { useState } from "react";
import { FaVideo, FaFileAlt, FaQuestionCircle } from "react-icons/fa";
import { TextEditor } from "@/components/Course/Lecture-components/TextEditor";
import { VideoUpload } from "@/components/Course/Lecture-components/VideoUpload";
import { QuizEditor } from "@/components/Course/Lecture-components/QuizEditor";
import { LectureType, QuizQuestion } from "@/types/lecture";
import toast from "react-hot-toast";

interface AddLectureProps {
    courseId: number;
    onComplete: () => void;
}

export const AddLecture = ({ courseId, onComplete }: AddLectureProps) => {
    const [lectures, setLectures] = useState<{
        id?: number;
        title: string;
        type: LectureType;
        content?: string;
        videoUrl?: string;
        videoDescription?: string;
        questions?: QuizQuestion[];
        order: number;
    }[]>([]);

    const [currentLecture, setCurrentLecture] = useState({
        title: "",
        type: "text" as LectureType,
        content: "",
        videoUrl: "",
        videoDescription: "",
        questions: [] as QuizQuestion[],
        order: 1
    });

    const [activeTab, setActiveTab] = useState<LectureType>("text");

    const validateLecture = () => {
        if (!currentLecture.title.trim()) {
            toast.error("Zadejte název lekce");
            return false;
        }

        switch (activeTab) {
            case "text":
                if (!currentLecture.content.trim()) {
                    toast.error("Přidejte obsah lekce");
                    return false;
                }
                break;
            case "video":
                if (!currentLecture.videoUrl) {
                    toast.error("Přidejte video URL");
                    return false;
                }
                break;
            case "quiz":
                if (!currentLecture.questions.length) {
                    toast.error("Přidejte alespoň jednu otázku");
                    return false;
                }
                break;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateLecture()) {
            return;
        }

        try {
            const lectureData = {
                courseId,
                title: currentLecture.title,
                type: activeTab,
                content: activeTab === "text" ? currentLecture.content : null,
                videoUrl: activeTab === "video" ? currentLecture.videoUrl : null,
                videoDescription: activeTab === "video" ? currentLecture.videoDescription : null,
                questions: activeTab === "quiz" ? currentLecture.questions : null,
                order: lectures.length + 1
            };

            const response = await fetch("/api/lectures", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lectureData),
            });

            if (!response.ok) {
                console.log("Error adding lecture:", response.statusText);
                toast.error("Nepodařilo se přidat lekci");
            }

            const newLecture = await response.json();
            setLectures([...lectures, newLecture]);

            setCurrentLecture({
                title: "",
                type: "text",
                content: "",
                videoUrl: "",
                videoDescription: "",
                questions: [],
                order: lectures.length + 2
            });
            setActiveTab("text");
            toast.success("Lekce byla přidána");
        } catch (err) {
            toast.error("Nepodařilo se přidat lekci");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Přidat lekci {lectures.length + 1}</h2>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    Název lekce *
                </label>
                <input
                    type="text"
                    value={currentLecture.title}
                    onChange={(e) => setCurrentLecture({ ...currentLecture, title: e.target.value })}
                    placeholder="Název lekce"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>

            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab("text")}
                        className={`px-4 py-2 ${activeTab === "text" ? "border-b-2 border-blue-500" : ""}`}
                    >
                        <FaFileAlt className="inline mr-2"/> Text
                    </button>
                    <button
                        onClick={() => setActiveTab("video")}
                        className={`px-4 py-2 ${activeTab === "video" ? "border-b-2 border-blue-500" : ""}`}
                    >
                        <FaVideo className="inline mr-2"/> Video
                    </button>
                    <button
                        onClick={() => setActiveTab("quiz")}
                        className={`px-4 py-2 ${activeTab === "quiz" ? "border-b-2 border-blue-500" : ""}`}
                    >
                        <FaQuestionCircle className="inline mr-2"/> Test
                    </button>
                </nav>
            </div>

            <div className="mb-6">
                {activeTab === "text" && (
                    <TextEditor
                        value={currentLecture.content}
                        onChange={(content) => setCurrentLecture({ ...currentLecture, content })}
                    />
                )}
                {activeTab === "video" && (
                    <VideoUpload
                        onVideoUrlChange={(url) => setCurrentLecture({ ...currentLecture, videoUrl: url })}
                        onDescriptionChange={(desc) => setCurrentLecture({ ...currentLecture, videoDescription: desc })}
                    />
                )}
                {activeTab === "quiz" && (
                    <QuizEditor
                        questions={currentLecture.questions}
                        onChange={(questions) => setCurrentLecture({ ...currentLecture, questions })}
                    />
                )}
            </div>

            {lectures.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-semibold mb-3">Přidané lekce:</h3>
                    <div className="space-y-2">
                        {lectures.map((lecture, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                <span>
                                    Lekce {index + 1}: {lecture.title} ({lecture.type})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-3">
                <button
                    onClick={handleSubmit}
                    disabled={!currentLecture.title}
                    className={`px-4 py-2 rounded-lg ${
                        !currentLecture.title
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                    Přidat lekci {lectures.length + 1}
                </button>
                {lectures.length > 0 && (
                    <button
                        onClick={onComplete}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Dokončit
                    </button>
                )}
            </div>
        </div>
    );
};