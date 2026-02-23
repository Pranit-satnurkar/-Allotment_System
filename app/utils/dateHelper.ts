import { format, nextThursday, isThursday, startOfDay } from "date-fns";

/**
 * Returns the date for the upcoming Thursday.
 * If today is Thursday, returns today's date.
 */
export function getNextThursday(): string {
    const today = startOfDay(new Date());
    const targetDate = isThursday(today) ? today : nextThursday(today);
    return format(targetDate, "dd/MM/yyyy");
}

/**
 * Returns today's date formatted as DD/MM/YYYY.
 */
export function getTodayDate(): string {
    return format(new Date(), "dd/MM/yyyy");
}

/**
 * Formats the reading date for the message header in Marathi.
 * Example: दि. 19/02/2026 गुरुवार
 */
export function getFormattedReadingDate(): string {
    const dateStr = getNextThursday();
    return `दि. ${dateStr} गुरुवार`;
}
