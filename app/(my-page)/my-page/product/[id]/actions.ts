"use server";

import { fireStore, storage } from "@/config/firebase/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { redirect } from "next/navigation";
import { urlToBase64 } from "@/libs/utils/format";
import { IProduct } from "@/model/product";
import { COLLECTION_NAME_PRODUCT } from "@/constants/variables";
import { IResponse } from "@/model/responses";
import { getFileNameFromUrl } from "@/libs/utils/image";

export async function getProductById(
	productId: string
): Promise<IProduct | null> {
	try {
		const docRef = doc(fireStore, COLLECTION_NAME_PRODUCT, productId);
		console.log("Fetching document with ID:", productId);

		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log("Document data:", docSnap.data());
			const data = docSnap.data();

			// const fileName = getFileNameFromUrl(data.productImages);

			if (data.productImages && Array.isArray(data.productImages)) {
				const base64Images = await Promise.all(
					data.productImages.map(async (url) => {
						const base64 = await urlToBase64(url);
						return `data:image/jpeg;base64,${base64}`;
					})
				);

				const fileNames = data.productImages.map((url) => {
					const fileName = getFileNameFromUrl(url, "products");
					return fileName;
				});

				data.productImages = base64Images;
				data.fileNames = fileNames;
			}

			console.log(data);

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

		const response: IResponse = {
			status: 200,
			success: true,
			message: "Product updated successfully",
		};

		return response;
	} catch (error) {
		console.error("Error updating product: ", error);
		const response: IResponse = {
			status: 400,
			success: false,
			message: "Product updated failed",
		};

		return response;
	}
	// redirect("/my-page/product-list");
}

export async function deleteProduct(productId: any) {
	console.log(productId);

	try {
		const productRef = doc(fireStore, "Product", productId);
		await deleteDoc(productRef);
		const response: IResponse = {
			status: 200,
			success: true,
			message: "Product delete successfully",
		};

		return response;
	} catch (error) {
		const response: IResponse = {
			status: 400,
			success: false,
			message: "Product delete failed",
		};

		return response;
	}
}
