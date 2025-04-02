"use client";

import React from "react";
import { QuizQuestion } from "@/types/lecture";
import { FaPlus, FaTrash } from "react-icons/fa";

interface QuizEditorProps {
    questions: QuizQuestion[];
    onChange: (questions: QuizQuestion[]) => void;
}

export const QuizEditor = ({ questions, onChange }: QuizEditorProps) => {
    const addQuestion = () => {
        const newQuestion: QuizQuestion = {
            question: "",
            options: [""],
            type: "multiple",
            correctAnswers: [],
            correctText: "",
        };
        onChange([...questions, newQuestion]);
    };

    const removeQuestion = (index: number) => {
        const newQuestions = questions.filter((_, idx) => idx !== index);
        onChange(newQuestions);
    };

    const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        onChange(newQuestions);
    };

    return (
        <div className="space-y-6">
            {questions.map((q, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                        <input
                            type="text"
                            value={q.question}
                            onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg mr-2"
                            placeholder="Otázka"
                        />
                        <button
                            type="button"
                            onClick={() => removeQuestion(idx)}
                            className="p-2 text-red-500 hover:text-red-700"
                        >
                            <FaTrash />
                        </button>
                    </div>

                    <div className="mb-4">
                        <select
                            value={q.type}
                            onChange={(e) => updateQuestion(idx, 'type', e.target.value as 'multiple' | 'text')}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="multiple">Výběr z možností</option>
                            <option value="text">Textová odpověď</option>
                        </select>
                    </div>

                    {q.type === 'multiple' ? (
                        <div className="space-y-2">
                            {q.options.map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={(q.correctAnswers || []).includes(optIdx)}
                                        onChange={(e) => {
                                            const currentAnswers = q.correctAnswers || [];
                                            const newCorrectAnswers = e.target.checked
                                                ? [...currentAnswers, optIdx]
                                                : currentAnswers.filter(a => a !== optIdx);
                                            updateQuestion(idx, 'correctAnswers', newCorrectAnswers);
                                        }}
                                        className="h-4 w-4 text-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                            const newOptions = [...q.options];
                                            newOptions[optIdx] = e.target.value;
                                            updateQuestion(idx, 'options', newOptions);
                                        }}
                                        className="flex-1 px-3 py-2 border rounded-lg"
                                        placeholder={`Možnost ${optIdx + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newOptions = q.options.filter((_, i) => i !== optIdx);
                                            updateQuestion(idx, 'options', newOptions);
                                        }}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    const newOptions = [...q.options, ""];
                                    updateQuestion(idx, 'options', newOptions);
                                }}
                                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                <FaPlus className="inline mr-2" /> Přidat možnost
                            </button>
                        </div>
                    ) : (
                        <textarea
                            value={q.correctText || ""}
                            onChange={(e) => updateQuestion(idx, 'correctText', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={4}
                            placeholder="Správná odpověď"
                        />
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addQuestion}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                <FaPlus className="mr-2" /> Přidat otázku
            </button>
        </div>
    );
};