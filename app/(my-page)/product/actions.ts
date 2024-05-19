// app/actions/uploadProduct.ts
"use server";

export async function uploadProduct(formData: FormData) {
	const data = {
		productImages: formData.getAll("images"),
		productName: formData.get("productName"),
		productType: formData.get("selectedType"),
		productSize: formData.get("selectedSize"),
		productHeight: formData.get("height"),
		productGender: formData.get("selectedGender"),
		productStyles: formData.get("selectedStyles"),
	};

	console.log(data);

	return {
		success: true,
		message: "Product uploaded successfully!",
	};
}
