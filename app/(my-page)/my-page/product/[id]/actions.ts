"use server";

import { fireStore, storage } from "@/config/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { redirect } from "next/navigation";
import { urlToBase64 } from "@/libs/utils/format";
import { IProduct } from "@/model/product";
import { COLLECTION_NAME_PRODUCT } from "@/constants/variables";


export async function getProductById(
	productId: string
): Promise<IProduct | null> {
	try {
		const docRef = doc(fireStore, COLLECTION_NAME_PRODUCT, productId);
		console.log("Fetching document with ID:", productId);

		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
			const data = docSnap.data();

			if (data.productImages && Array.isArray(data.productImages)) {
				const base64Images = await Promise.all(
					data.productImages.map(async (url) => {
						const base64 = await urlToBase64(url);
						return `data:image/jpeg;base64,${base64}`;
					})
				);

				data.productImages = base64Images;
			}

			return { id: docSnap.id, ...data } as IProduct;
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

		const docRef = doc(fireStore, COLLECTION_NAME_PRODUCT, data.productId);
		await updateDoc(docRef, productData);
	} catch (error) {
		console.error("Error updating product: ", error);
		return {
			success: false,
			message: "Failed to update product",
		};
	}
	redirect("/my-page/product-list");
}
