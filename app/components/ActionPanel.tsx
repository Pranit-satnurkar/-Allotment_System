"use client";

import { getTodayDate, getNextThursday } from "@/app/utils/dateHelper";

type ActionPanelProps = {
    onRotate: () => void;
    onGenerate: () => void;
    onCopy: () => void;
    totalMembers: number;
    isMessageGenerated: boolean;
};

export default function ActionPanel({
    onRotate,
    onGenerate,
    onCopy,
    totalMembers,
    isMessageGenerated,
}: ActionPanelProps) {
    const today = getTodayDate();
    const nextThursday = getNextThursday();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 mt-4 sm:-mt-8">
            {/* Status Card */}
            <div className="card flex flex-col justify-between p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-green-primary">Week Info</h2>
                    <span className="bg-green-light text-green-primary px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                        Live
                    </span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-text-muted">Today:</span>
                        <span className="font-semibold">{today}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-text-muted">Reading (Thu):</span>
                        <span className="font-semibold text-green-primary">{nextThursday}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 sm:pt-3 text-sm sm:text-base">
                        <span className="text-text-muted">Members:</span>
                        <span className="font-semibold">{totalMembers} / 21</span>
                    </div>
                </div>
            </div>

            {/* Actions Card */}
            <div className="card flex flex-col justify-center gap-3 sm:gap-4 p-4 sm:p-6">
                <button
                    onClick={onRotate}
                    className="btn-primary w-full py-3 sm:py-2 text-sm sm:text-base"
                >
                    Rotate Chapters (1 → 21)
                </button>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={onGenerate}
                        className="btn-secondary flex-1 py-3 sm:py-2 text-sm sm:text-base"
                    >
                        Generate Message
                    </button>
                    <button
                        onClick={onCopy}
                        disabled={!isMessageGenerated}
                        className="btn-secondary flex-1 py-3 sm:py-2 text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                    >
                        Copy Message
                    </button>
                </div>
            </div>
        </div>
    );
}
