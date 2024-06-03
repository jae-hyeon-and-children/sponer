import { Timestamp } from "firebase/firestore";

export function timeStampToDate(timeStamp: Timestamp): Date {
	const milliseconds = timeStamp.seconds * 1000;
	return new Date(milliseconds);
}

export function getDateTextWith(date: Date): string {
	const hours = date.getHours();
	const minutes = date.getMinutes();

	const formattedHours = hours < 10 ? "0" + hours : hours;
	const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

	return formattedHours + ":" + formattedMinutes;
}

export function getFullDate(timestamp: Timestamp): string {
	const date = timestamp.toDate();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
