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
import { z } from "zod";

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

const productSchema = z.object({
	productImages: z
		.array(z.instanceof(File))
		.min(1, "최소 한장의 사진이 필요합니다."),
	productType: z.string().min(1, "타입은 필수입니다."),
	productSize: z.string().min(1, "사이즈는 필수입니다."),
	productGender: z.string().min(1, "분류는 필수입니다."),
	productStyles: z.array(z.string()).min(1, "최소 하나의 스타일이 필요합니다."),
	productName: z.string().min(1, "상품 이름은 필수입니다."),
	productHeight: z.string(),
	productId: z.string(),
});

export async function updateProduct(
	otherData: any,
	formData: FormData
): Promise<IResponse> {
	try {
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

		const parsedData = productSchema.parse(data);

		const imageUploadPromises = parsedData.productImages.map(async (image) => {
			const storageRef = ref(storage, `products/${image.name}`);
			await uploadBytes(storageRef, image);
			const downloadUrl = await getDownloadURL(storageRef);
			return downloadUrl;
		});

		const imageUrls = await Promise.all(imageUploadPromises);

		// console.log(imageUrls);

		const productData = {
			title: parsedData.productName,
			productCategory: parsedData.productType,
			size: parsedData.productSize.toLowerCase(),
			height: parsedData.productHeight,
			genderCategory: parsedData.productGender,
			styleCategory: parsedData.productStyles,
			productImages:
				typeof parsedData.productImages[0] === "string"
					? parsedData.productImages
					: imageUrls,
			updatedAt: new Date(),
		};

		const docRef = doc(fireStore, COLLECTION_NAME_PRODUCT, data.productId);
		await updateDoc(docRef, productData);

		return {
			status: 200,
			success: true,
			message: "Product updated successfully",
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error("Validation Error:", error.errors);
			return {
				status: 400,
				success: false,
				message: "Validation error",
				errors: error.errors.map((e) => ({
					path: e.path,
					message: e.message,
				})),
			};
		} else {
			console.error("Error updating product: ", error);
			return {
				status: 500,
				success: false,
				message: "Product update failed",
			};
		}
	}
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
