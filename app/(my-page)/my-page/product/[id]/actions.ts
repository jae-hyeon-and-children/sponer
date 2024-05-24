"use server";

import { fireStore, storage } from "@/config/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Product } from "../../product-list/page";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { redirect } from "next/navigation";

export async function getProductById(
	productId: string
): Promise<Product | null> {
	try {
		const docRef = doc(fireStore, "Product", productId);
		console.log("Fetching document with ID:", productId);

		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
			return { id: docSnap.id, ...docSnap.data() } as Product;
		} else {
			console.log("No such document!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching document:", error);
		return null;
	}
}

export async function updateProduct(otherData: any, formData: FormData) {
	console.log(otherData);

	const data = {
		productImages: otherData.getAll("images") as File[],
		productType: otherData.get("selectedType") as string,
		productSize: otherData.get("selectedSize") as string,
		productGender: otherData.get("selectedGender") as string,
		productStyles: otherData.getAll("selectedStyles") as string[],
		productName: formData.get("productName") as string,
		productHeight: formData.get("height") as string,
		productId: otherData.get("productId") as string,
	};

	try {
		const imageUploadPromises = data.productImages.map(async (image) => {
			const storageRef = ref(storage, `products/${image.name}`);
			await uploadBytes(storageRef, image);
			const downloadUrl = await getDownloadURL(storageRef);
			return downloadUrl;
		});

		const imageUrls = await Promise.all(imageUploadPromises);

		// console.log(imageUrls);

		const productData = {
			title: data.productName,
			productCategory: data.productType,
			size: data.productSize,
			height: data.productHeight,
			genderCategory: data.productGender,
			styleCategory: data.productStyles,
			productImages:
				typeof data.productImages[0] === "string"
					? data.productImages
					: imageUrls,
			updatedAt: new Date(),
		};

		const docRef = doc(fireStore, "Product", data.productId);
		await updateDoc(docRef, productData);

		// redirect("/my-page/product-list");

		return {
			success: true,
			message: "Product updated successfully!",
		};
	} catch (error) {
		console.error("Error updating product: ", error);
		return {
			success: false,
			message: "Failed to update product",
		};
	}
}
