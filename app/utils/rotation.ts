import { Member } from "@/app/types/member";

const TOTAL_CHAPTERS = 21;

/**
 * Rotates each member's chapter by 1.
 * Wraps from 21 → 1.
 * Formula: nextChapter = (currentChapter % 21) + 1
 */
export function rotateChapters(members: Member[]): Member[] {
    return members.map((member) => ({
        ...member,
        currentChapter: (member.currentChapter % TOTAL_CHAPTERS) + 1,
    }));
}
