"use client";

import { useState } from "react";
import { Member } from "@/app/types/member";

type MemberTableProps = {
    members: Member[];
    onAdd: (newMember: Member) => void;
    onBulkAdd: (names: string[]) => void;
    onEdit: (updatedMember: Member, syncChapters?: boolean) => void;
    onDelete: (id: string) => void;
};

export default function MemberTable({
    members,
    onAdd,
    onBulkAdd,
    onEdit,
    onDelete,
}: MemberTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [nameInput, setNameInput] = useState("");
    const [chapterInput, setChapterInput] = useState<number>(1);
    const [bulkInput, setBulkInput] = useState("");
    const [syncChapters, setSyncChapters] = useState(false);

    const openAddModal = () => {
        setEditingMember(null);
        setNameInput("");
        setChapterInput(members.length > 0 ? (members[members.length - 1].currentChapter % 21) + 1 : 1);
        setSyncChapters(false);
        setIsModalOpen(true);
    };

    const openBulkModal = () => {
        setBulkInput("");
        setIsBulkModalOpen(true);
    };

    const openEditModal = (member: Member) => {
        setEditingMember(member);
        setNameInput(member.name);
        setChapterInput(member.currentChapter);
        setSyncChapters(true); // Default to true as per user request (Auto-Sync)
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameInput.trim()) return;

        if (editingMember) {
            onEdit({ ...editingMember, name: nameInput, currentChapter: chapterInput }, syncChapters);
        } else {
            onAdd({
                id: crypto.randomUUID(),
                name: nameInput,
                currentChapter: chapterInput,
            });
        }
        setIsModalOpen(false);
    };

    const handleBulkSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const names = bulkInput
            .split("\n")
            .map((name) => name.trim())
            .filter((name) => name.length > 0);

        if (names.length > 0) {
            onBulkAdd(names);
        }
        setIsBulkModalOpen(false);
    };

    return (
        <div className="card mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-green-primary">Member Management</h2>
                <div className="flex w-full sm:w-auto gap-2">
                    <button onClick={openBulkModal} className="btn-secondary flex-1 sm:flex-none py-2 px-4 text-sm">
                        Bulk Add
                    </button>
                    <button onClick={openAddModal} className="btn-primary flex-1 sm:flex-none py-2 px-4 text-sm">
                        + Add Member
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto hidden sm:block">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-4 px-4 text-sm font-bold text-text-muted">NAME</th>
                            <th className="py-4 px-4 text-sm font-bold text-text-muted">CURRENT CHAPTER</th>
                            <th className="py-4 px-4 text-sm font-bold text-text-muted text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-10 text-center text-text-muted italic">
                                    No members added yet. Please add up to 21 members.
                                </td>
                            </tr>
                        ) : (
                            members.map((member) => (
                                <tr key={member.id} className="border-b border-gray-50 hover:bg-bg-soft/50 transition-colors">
                                    <td className="py-4 px-4 font-semibold text-text-main">{member.name}</td>
                                    <td className="py-4 px-4">
                                        <span className="bg-green-light text-green-primary px-3 py-1 rounded-lg font-bold">
                                            अध्याय {member.currentChapter}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right space-x-2">
                                        <button onClick={() => openEditModal(member)} className="btn-edit">
                                            Edit
                                        </button>
                                        <button onClick={() => onDelete(member.id)} className="btn-danger">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View: Card List */}
            <div className="sm:hidden space-y-4">
                {members.length === 0 ? (
                    <div className="py-10 text-center text-text-muted italic bg-bg-soft rounded-xl border border-dashed border-gray-200">
                        No members added yet.
                    </div>
                ) : (
                    members.map((member) => (
                        <div key={member.id} className="bg-bg-soft rounded-xl p-4 border border-gray-100 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-text-main text-lg">{member.name}</span>
                                <span className="bg-green-light text-green-primary px-3 py-1 rounded-lg font-extrabold text-sm">
                                    {member.currentChapter}
                                </span>
                            </div>
                            <div className="flex gap-2 border-t pt-3 mt-1">
                                <button
                                    onClick={() => openEditModal(member)}
                                    className="flex-1 btn-edit py-2.5 flex justify-center items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(member.id)}
                                    className="flex-1 btn-danger py-2.5 flex justify-center items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Individual Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-green-primary mb-6">
                            {editingMember ? "Edit Member" : "Add New Member"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="label">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    className="input-field"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    placeholder="e.g. Kalyani Khope"
                                />
                            </div>
                            <div>
                                <label className="label">Current Chapter (1-21)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="21"
                                    required
                                    className="input-field"
                                    value={chapterInput}
                                    onChange={(e) => setChapterInput(parseInt(e.target.value))}
                                />
                            </div>
                            {editingMember && (
                                <div className="flex items-center gap-3 bg-green-light/30 p-4 rounded-xl border border-green-light">
                                    <input
                                        type="checkbox"
                                        id="syncChapters"
                                        className="w-5 h-5 accent-green-primary rounded focus:ring-green-primary"
                                        checked={syncChapters}
                                        onChange={(e) => setSyncChapters(e.target.checked)}
                                    />
                                    <label htmlFor="syncChapters" className="text-sm font-medium text-green-primary cursor-pointer select-none">
                                        Auto-sync Group? (Updates all subsequent members n+1)
                                    </label>
                                </div>
                            )}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary w-full"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary w-full">
                                    {editingMember ? "Save Changes" : "Add Member"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Add Modal */}
            {isBulkModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-green-primary mb-2">
                            Bulk Add Members
                        </h3>
                        <p className="text-sm text-text-muted mb-6">
                            Paste one name per line. Chapters will be assigned automatically.
                        </p>
                        <form onSubmit={handleBulkSubmit} className="space-y-6">
                            <div>
                                <label className="label">Names List</label>
                                <textarea
                                    required
                                    autoFocus
                                    className="input-field h-48 resize-none py-2"
                                    value={bulkInput}
                                    onChange={(e) => setBulkInput(e.target.value)}
                                    placeholder="Kalyani Khope&#10;Sunil Deshmukh&#10;..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsBulkModalOpen(false)}
                                    className="btn-secondary w-full"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary w-full">
                                    Import Members
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
