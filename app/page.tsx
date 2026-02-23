"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import ActionPanel from "./components/ActionPanel";
import MemberTable from "./components/MemberTable";
import MessagePreview from "./components/MessagePreview";
import GroupTabs from "./components/GroupTabs";
import { Member, Group } from "./types/member";
import { rotateChapters } from "./utils/rotation";
import { generateMessage } from "./utils/messageGenerator";

const GROUPS_STORAGE_KEY = "kalpavriksha_groups_v1";
const OLD_MEMBERS_STORAGE_KEY = "kalpavriksha_members_v1";

const INITIAL_GROUPS: Group[] = [
    {
        id: "default-1",
        name: "पारायण गृप १",
        members: [
            { id: "1", name: "Member 1", currentChapter: 1 },
            { id: "2", name: "Member 2", currentChapter: 2 },
        ],
    },
];

export default function Home() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [activeGroupId, setActiveGroupId] = useState("");
    const [generatedMessage, setGeneratedMessage] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    // Migration and Load
    useEffect(() => {
        const savedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
        const savedOldMembers = localStorage.getItem(OLD_MEMBERS_STORAGE_KEY);

        if (savedGroups) {
            try {
                const parsed = JSON.parse(savedGroups);
                setGroups(parsed);
                if (parsed.length > 0) setActiveGroupId(parsed[0].id);
            } catch (e) {
                setGroups(INITIAL_GROUPS);
                setActiveGroupId(INITIAL_GROUPS[0].id);
            }
        } else if (savedOldMembers) {
            // Migrate old data
            try {
                const oldMembers = JSON.parse(savedOldMembers);
                const migratedGroup: Group = {
                    id: crypto.randomUUID(),
                    name: "पारायण गृप १",
                    members: oldMembers,
                };
                setGroups([migratedGroup]);
                setActiveGroupId(migratedGroup.id);
                // Clear old key to prevent re-migration
                localStorage.removeItem(OLD_MEMBERS_STORAGE_KEY);
            } catch (e) {
                setGroups(INITIAL_GROUPS);
                setActiveGroupId(INITIAL_GROUPS[0].id);
            }
        } else {
            setGroups(INITIAL_GROUPS);
            setActiveGroupId(INITIAL_GROUPS[0].id);
        }
        setIsLoaded(true);
    }, []);

    // Save
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
        }
    }, [groups, isLoaded]);

    const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

    const updateActiveGroupMembers = (newMembers: Member[]) => {
        setGroups(
            groups.map((g) =>
                g.id === activeGroupId ? { ...g, members: newMembers } : g
            )
        );
    };

    const handleAddGroup = () => {
        const newGroup: Group = {
            id: crypto.randomUUID(),
            name: `पारायण गृप ${groups.length + 1}`,
            members: [],
        };
        setGroups([...groups, newGroup]);
        setActiveGroupId(newGroup.id);
        setGeneratedMessage("");
    };

    const handleRenameGroup = (id: string, newName: string) => {
        setGroups(groups.map((g) => (g.id === id ? { ...g, name: newName } : g)));
    };

    const handleDeleteGroup = (id: string) => {
        if (groups.length <= 1) return;
        if (confirm("Are you sure you want to delete this group? All members will be removed.")) {
            const remaining = groups.filter((g) => g.id !== id);
            setGroups(remaining);
            if (activeGroupId === id) setActiveGroupId(remaining[0].id);
            setGeneratedMessage("");
        }
    };

    const handleAddMember = (newMember: Member) => {
        if (activeGroup.members.length >= 21) {
            alert("Limit reached: Max 21 members allowed per group.");
            return;
        }
        updateActiveGroupMembers([...activeGroup.members, newMember]);
        setGeneratedMessage("");
    };

    const handleBulkAdd = (names: string[]) => {
        const availableSpace = 21 - activeGroup.members.length;
        if (availableSpace <= 0) {
            alert("Limit reached: Max 21 members allowed.");
            return;
        }

        const namesToAdd = names.slice(0, availableSpace);
        let lastChapter = activeGroup.members.length > 0
            ? activeGroup.members[activeGroup.members.length - 1].currentChapter
            : 0;

        const newMembers: Member[] = namesToAdd.map((name) => {
            lastChapter = (lastChapter % 21) + 1;
            return {
                id: crypto.randomUUID(),
                name,
                currentChapter: lastChapter,
            };
        });

        updateActiveGroupMembers([...activeGroup.members, ...newMembers]);
        setGeneratedMessage("");
    };

    const handleEditMember = (updatedMember: Member, syncChapters?: boolean) => {
        let newMembers = [...activeGroup.members];
        const index = newMembers.findIndex((m) => m.id === updatedMember.id);

        if (index !== -1) {
            newMembers[index] = updatedMember;

            if (syncChapters) {
                // Cascading sync: Update subsequent members
                let currentChapter = updatedMember.currentChapter;
                for (let i = index + 1; i < newMembers.length; i++) {
                    currentChapter = (currentChapter % 21) + 1;
                    newMembers[i] = { ...newMembers[i], currentChapter };
                }
            }
        }

        updateActiveGroupMembers(newMembers);
        setGeneratedMessage("");
    };

    const handleDeleteMember = (id: string) => {
        if (confirm("Are you sure you want to delete this member?")) {
            updateActiveGroupMembers(activeGroup.members.filter((m) => m.id !== id));
            setGeneratedMessage("");
        }
    };

    const handleRotate = () => {
        if (activeGroup.members.length === 0) return;
        if (confirm(`Rotate chapters for "${activeGroup.name}"? All members will advance.`)) {
            updateActiveGroupMembers(rotateChapters(activeGroup.members));
            setGeneratedMessage("");
        }
    };

    const handleGenerate = () => {
        if (activeGroup.members.length === 0) {
            alert("Please add members first.");
            return;
        }
        setGeneratedMessage(generateMessage(activeGroup.members));
    };

    const handleCopy = async () => {
        if (!generatedMessage) return;
        try {
            await navigator.clipboard.writeText(generatedMessage);
            alert("Message copied to clipboard!");
        } catch (err) {
            alert("Failed to copy message.");
        }
    };

    if (!isLoaded || !activeGroup) return null;

    return (
        <main className="min-h-screen pb-20">
            <Header />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8">
                <GroupTabs
                    groups={groups}
                    activeGroupId={activeGroupId}
                    onSelectGroup={setActiveGroupId}
                    onAddGroup={handleAddGroup}
                    onRenameGroup={handleRenameGroup}
                    onDeleteGroup={handleDeleteGroup}
                />

                <ActionPanel
                    onRotate={handleRotate}
                    onGenerate={handleGenerate}
                    onCopy={handleCopy}
                    totalMembers={activeGroup.members.length}
                    isMessageGenerated={!!generatedMessage}
                />

                <MemberTable
                    members={activeGroup.members}
                    onAdd={handleAddMember}
                    onBulkAdd={handleBulkAdd}
                    onEdit={handleEditMember}
                    onDelete={handleDeleteMember}
                />

                <MessagePreview
                    message={generatedMessage}
                    setMessage={setGeneratedMessage}
                />
            </div>

            <footer className="text-center text-text-muted text-sm mt-10">
                पारायण व्यवस्थापन &copy; 2026
            </footer>
        </main>
    );
}
