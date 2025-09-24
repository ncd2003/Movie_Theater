import { format, parseISO, isValid } from "date-fns";

export const formatDateToDDMMYYY = (date) => {
    if (!date) return "";

    let parsedDate;

    if (typeof date === "string") {
        parsedDate = parseISO(date); // Convert ISO string (yyyy-MM-dd) to Date object
    } else {
        parsedDate = date; // Assume it's already a Date object
    }

    // Ensure it's a valid date
    if (!isValid(parsedDate)) return "Invalid date";

    return format(parsedDate, "dd/MM/yyyy");
}

export const formatDateToDDMMYYYHHMMSS = (isoString) => {
    if (!isoString) return "N/A"; // Kiểm tra giá trị null hoặc undefined

    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
