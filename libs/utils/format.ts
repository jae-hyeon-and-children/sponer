import fetch from "node-fetch";

export const urlToBase64 = async (url: string) => {
	const response = await fetch(url);
	const buffer = await response.buffer();
	return buffer.toString("base64");
};