import { Member } from "@/app/types/member";
import { getFormattedReadingDate } from "./dateHelper";

/**
 * Generates the full Marathi WhatsApp message template.
 */
export function generateMessage(members: Member[]): string {
    const readingDate = getFormattedReadingDate();

    // Create padded member list
    // Format: *Name*      *Chapter*
    // We sort by chapter to make it easy for readers
    const memberList = members
        .sort((a, b) => a.currentChapter - b.currentChapter)
        .map((m) => `${m.name.padEnd(21)} ${m.currentChapter}`)
        .join("\n");

    const template = `जय गजानन!
*पारायण गृप*

*${readingDate}* ला वाचावयाचे अध्याय खाली दिले आहे.

*भक्ताचे नांव*           *अध्याय*

${memberList}

अध्याय वाचल्यानंतर गृपवर त्वरित कळविणे आवश्यक आहे.`;

    return template;
}
