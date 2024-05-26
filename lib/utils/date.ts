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
