export function getFileNameFromUrl(url: string, type: string) {
	const path = url.split("?")[0];

	const encodedFileName = path.substring(path.lastIndexOf("/") + 1);

	const fileName = decodeURIComponent(encodedFileName);
	if (type === "products") {
		return fileName.replace(/^products\//, "");
	} else if (type === "profile") {
		return fileName.replace(/^profile_images\//, "");
	} else if (type === "business") {
		return fileName.replace(/^business_certificate_image\//, "");
	}
}
