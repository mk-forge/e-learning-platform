"use client";

import { useState, useEffect } from "react";
import { FaVideo, FaFileAlt, FaQuestionCircle, FaEdit, FaTrash } from "react-icons/fa";
import { TextEditor } from "@/components/Course/Lecture-components/TextEditor";
import { VideoUpload } from "@/components/Course/Lecture-components/VideoUpload";
import { QuizEditor } from "@/components/Course/Lecture-components/QuizEditor";
import { LectureType, QuizQuestion } from "@/types/lecture";
import toast from "react-hot-toast";

interface AddLectureProps {
    courseId: number;
    onComplete: () => void;
}

interface Lecture {
    id?: number;
    title: string;
    type: LectureType;
    content?: string;
    videoUrl?: string;
    questions?: QuizQuestion[];
    order: number;
}

export const AddLecture = ({ courseId, onComplete }: AddLectureProps) => {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingLectureId, setEditingLectureId] = useState<number | null>(null);
    const [deletingLectureId, setDeletingLectureId] = useState<number | null>(null);

    const [currentLecture, setCurrentLecture] = useState<Lecture>({
        title: "",
        content: "",
        videoUrl: "",
        questions: [],
        order: 1,
        type: "text"
    });

    const [activeSection, setActiveSection] = useState<string>("text");
    const [contentSections, setContentSections] = useState({
        text: false,
        video: false,
        quiz: false
    });

    useEffect(() => {
        fetchLectures();
    }, [courseId]);

    const fetchLectures = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/lectures?courseId=${courseId}`);

            if (!response.ok) {
                console.error("Error fetching lectures:", response.statusText);
                return;
            }

            const data = await response.json();
            setLectures(data);
        } catch (error) {
            console.error("Failed to fetch lectures:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateLecture = () => {
        if (!currentLecture.title.trim()) {
            toast.error("Zadejte název lekce");
            return false;
        }

        // Require at least one content type
        if (!contentSections.text && !contentSections.video && !contentSections.quiz) {
            toast.error("Přidejte alespoň jeden typ obsahu");
            return false;
        }

        // Validate each enabled content type
        if (contentSections.text && !currentLecture.content?.trim()) {
            toast.error("Přidejte textový obsah");
            return false;
        }

        if (contentSections.video && !currentLecture.videoUrl) {
            toast.error("Přidejte video URL");
            return false;
        }

        if (contentSections.quiz && (!currentLecture.questions || currentLecture.questions.length === 0)) {
            toast.error("Přidejte alespoň jednu otázku");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateLecture()) {
            return;
        }

        try {
            setIsLoading(true);

            let lectureType: "text" | "video" | "quiz" = "text";
            if (contentSections.quiz) {
                lectureType = "quiz";
            } else if (contentSections.video) {
                lectureType = "video";
            }

            const lectureData = {
                courseId,
                title: currentLecture.title,
                content: contentSections.text ? currentLecture.content : null,
                videoUrl: contentSections.video ? currentLecture.videoUrl : null,
                questions: contentSections.quiz ? currentLecture.questions : [],
                order: editingLectureId ? currentLecture.order : lectures.length + 1,
                type: lectureType
            };

            const url = editingLectureId
                ? `/api/lectures/${editingLectureId}`
                : "/api/lectures";

            const method = editingLectureId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lectureData),
            });

            if (!response.ok) {
                console.error("Error saving lecture:", response.statusText);
                toast.error(editingLectureId ? "Nepodařilo se aktualizovat lekci" : "Nepodařilo se přidat lekci");
                return;
            }

            const savedLecture = await response.json();

            if (editingLectureId) {
                setLectures(lectures.map(lec =>
                    lec.id === editingLectureId ? savedLecture : lec
                ));
                toast.success("Lekce byla aktualizována");
                setEditingLectureId(null);
            } else {
                setLectures([...lectures, savedLecture]);
                toast.success("Lekce byla přidána");
            }

            resetForm();
        } catch (err) {
            toast.error(editingLectureId ? "Nepodařilo se aktualizovat lekci" : "Nepodařilo se přidat lekci");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setCurrentLecture({
            title: "",
            content: "",
            videoUrl: "",
            questions: [],
            order: lectures.length + 1,
            type: "text"
        });
        setContentSections({
            text: false,
            video: false,
            quiz: false
        });
        setActiveSection("text");
        setEditingLectureId(null);
    };

    const handleEdit = (lecture: Lecture) => {
        setCurrentLecture({
            ...lecture,
            content: lecture.content || "",
            videoUrl: lecture.videoUrl || "",
            questions: lecture.questions || []
        });

        setContentSections({
            text: Boolean(lecture.content),
            video: Boolean(lecture.videoUrl),
            quiz: Boolean(lecture.questions && lecture.questions.length > 0)
        });

        if (lecture.content) setActiveSection("text");
        else if (lecture.videoUrl) setActiveSection("video");
        else if (lecture.questions) setActiveSection("quiz");

        setEditingLectureId(lecture.id ?? null);
    };

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/lectures/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                console.error("Error deleting lecture:", response.statusText);
                toast.error("Nepodařilo se smazat lekci");
                return;
            }

            setLectures(lectures.filter(lec => lec.id !== id));
            toast.success("Lekce byla smazána");

            const updatedLectures = lectures
                .filter(lec => lec.id !== id)
                .map((lec, idx) => ({...lec, order: idx + 1}));

            for (const lecture of updatedLectures) {
                if (lecture.id) {
                    await fetch(`/api/lectures/${lecture.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ order: lecture.order }),
                    });
                }
            }

            setLectures(updatedLectures);
        } catch (err) {
            toast.error("Nepodařilo se smazat lekci");
            console.error(err);
        } finally {
            setDeletingLectureId(null);
            setIsLoading(false);
        }
    };

    const toggleSection = (section: keyof typeof contentSections) => {
        setContentSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));

        setActiveSection(section);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
                {editingLectureId ? "Upravit lekci" : `Přidat lekci ${lectures.length + 1}`}
            </h2>

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
                <div className="flex space-x-4 mb-2">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={contentSections.text}
                            onChange={() => toggleSection("text")}
                            className="mr-2"
                        />
                        <FaFileAlt className="mr-1 text-blue-500"/> Text
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={contentSections.video}
                            onChange={() => toggleSection("video")}
                            className="mr-2"
                        />
                        <FaVideo className="mr-1 text-green-500"/> Video
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={contentSections.quiz}
                            onChange={() => toggleSection("quiz")}
                            className="mr-2"
                        />
                        <FaQuestionCircle className="mr-1 text-amber-500"/> Test
                    </label>
                </div>

                <nav className="flex space-x-4">
                    {contentSections.text && (
                        <button
                            onClick={() => setActiveSection("text")}
                            className={`px-4 py-2 ${activeSection === "text" ? "border-b-2 border-blue-500" : ""}`}
                        >
                            <FaFileAlt className="inline mr-2"/> Text
                        </button>
                    )}
                    {contentSections.video && (
                        <button
                            onClick={() => setActiveSection("video")}
                            className={`px-4 py-2 ${activeSection === "video" ? "border-b-2 border-blue-500" : ""}`}
                        >
                            <FaVideo className="inline mr-2"/> Video
                        </button>
                    )}
                    {contentSections.quiz && (
                        <button
                            onClick={() => setActiveSection("quiz")}
                            className={`px-4 py-2 ${activeSection === "quiz" ? "border-b-2 border-blue-500" : ""}`}
                        >
                            <FaQuestionCircle className="inline mr-2"/> Test
                        </button>
                    )}
                </nav>
            </div>

            <div className="mb-6">
                {contentSections.text && activeSection === "text" && (
                    <div>
                        <h3 className="font-medium mb-2">Textový obsah</h3>
                        <TextEditor
                            value={currentLecture.content || ""}
                            onChange={(content) => setCurrentLecture({ ...currentLecture, content })}
                        />
                    </div>
                )}

                {contentSections.video && activeSection === "video" && (
                    <div>
                        <h3 className="font-medium mb-2">Video</h3>
                        <VideoUpload
                            onVideoUrlChange={(url) => setCurrentLecture({ ...currentLecture, videoUrl: url })}
                        />
                    </div>
                )}

                {contentSections.quiz && activeSection === "quiz" && (
                    <div>
                        <h3 className="font-medium mb-2">Test</h3>
                        <QuizEditor
                            questions={currentLecture.questions || []}
                            onChange={(questions) => setCurrentLecture({ ...currentLecture, questions })}
                        />
                    </div>
                )}
            </div>

            {lectures.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-semibold mb-3">Přidané lekce:</h3>
                    <div className="space-y-2">
                        {lectures.map((lecture, index) => {
                            // Determine content types in this lecture
                            const hasText = Boolean(lecture.content);
                            const hasVideo = Boolean(lecture.videoUrl);
                            const hasQuiz = Boolean(lecture.questions && lecture.questions.length > 0);

                            return (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded-full text-xs mr-2">
                      {lecture.order}
                    </span>
                      {lecture.title}
                      <div className="ml-2 flex space-x-1">
                      {hasText && <FaFileAlt className="text-blue-500" />}
                          {hasVideo && <FaVideo className="text-green-500" />}
                          {hasQuiz && <FaQuestionCircle className="text-amber-500" />}
                    </div>
                  </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(lecture)}
                                            className="text-blue-500 hover:text-blue-700"
                                            disabled={isLoading}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => setDeletingLectureId(lecture.id ?? null)}
                                            className="text-red-500 hover:text-red-700"
                                            disabled={isLoading}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-3">
                {editingLectureId && (
                    <button
                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        disabled={isLoading}
                    >
                        Zrušit úpravy
                    </button>
                )}
                <button
                    onClick={handleSubmit}
                    disabled={!currentLecture.title || isLoading || (!contentSections.text && !contentSections.video && !contentSections.quiz)}
                    className={`px-4 py-2 rounded-lg ${
                        !currentLecture.title || isLoading || (!contentSections.text && !contentSections.video && !contentSections.quiz)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                    {isLoading ? "Ukládám..." : editingLectureId ? "Uložit změny" : `Přidat lekci ${lectures.length + 1}`}
                </button>
                {lectures.length > 0 && (
                    <button
                        onClick={onComplete}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        disabled={isLoading}
                    >
                        Dokončit
                    </button>
                )}
            </div>

            {/* Delete confirmation dialog */}
            {deletingLectureId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-medium mb-4">Potvrdit smazání</h3>
                        <p className="text-gray-600 mb-6">Opravdu chcete smazat tuto lekci?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeletingLectureId(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                disabled={isLoading}
                            >
                                Zrušit
                            </button>
                            <button
                                onClick={() => handleDelete(deletingLectureId)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                disabled={isLoading}
                            >
                                {isLoading ? "Mažu..." : "Smazat"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
