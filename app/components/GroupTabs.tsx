"use client";

import { useState } from "react";
import { Group } from "@/app/types/member";

type GroupTabsProps = {
    groups: Group[];
    activeGroupId: string;
    onSelectGroup: (id: string) => void;
    onAddGroup: () => void;
    onRenameGroup: (id: string, newName: string) => void;
    onDeleteGroup: (id: string) => void;
};

export default function GroupTabs({
    groups,
    activeGroupId,
    onSelectGroup,
    onAddGroup,
    onRenameGroup,
    onDeleteGroup,
}: GroupTabsProps) {
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const handleDoubleClick = (group: Group) => {
        setEditingGroupId(group.id);
        setEditName(group.name);
    };

    const handleBlur = (id: string) => {
        if (editName.trim()) {
            onRenameGroup(id, editName);
        }
        setEditingGroupId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === "Enter") {
            handleBlur(id);
        } else if (e.key === "Escape") {
            setEditingGroupId(null);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            {groups.map((group) => (
                <div
                    key={group.id}
                    className={`group relative flex items-center px-4 py-2 rounded-xl border transition-all duration-150 cursor-pointer ${activeGroupId === group.id
                            ? "bg-green-primary border-green-primary text-white shadow-md"
                            : "bg-white border-gray-200 text-text-main hover:border-green-accent"
                        }`}
                    onClick={() => onSelectGroup(group.id)}
                    onDoubleClick={() => handleDoubleClick(group)}
                >
                    {editingGroupId === group.id ? (
                        <input
                            autoFocus
                            className="bg-transparent border-none focus:ring-0 p-0 text-inherit font-semibold w-24 sm:w-32"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={() => handleBlur(group.id)}
                            onKeyDown={(e) => handleKeyDown(e, group.id)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className="font-semibold select-none">{group.name}</span>
                    )}

                    {groups.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteGroup(group.id);
                            }}
                            className={`ml-2 p-0.5 rounded-full hover:bg-red-500/20 transition-colors ${activeGroupId === group.id ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-red-500"
                                }`}
                            title="Delete Group"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={onAddGroup}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-green-primary hover:text-green-primary transition-all duration-150"
                title="Add New Group"
            >
                <span className="text-xl leading-none">+</span>
                <span className="text-sm font-semibold">New Group</span>
            </button>
        </div>
    );
}
