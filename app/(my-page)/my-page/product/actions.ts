"use server";

import { fireStore, storage } from "@/config/firebase/firebase";
import {
	COLLECTION_NAME_PRODUCT,
	COLLECTION_NAME_USER,
} from "@/constants/variables";
import { IProduct } from "@/model/product";
import { IResponse } from "@/model/responses";
import { initializeApp } from "firebase/app";
import {
	Timestamp,
	addDoc,
	collection,
	doc,
	getDoc,
	getFirestore,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
	productImages: z
		.array(z.instanceof(File))
		.min(1, "최소 한장의 사진이 필요합니다."),
	productType: z.string().min(1, "종류는 필수입니다."),
	productSize: z.string().min(1, "사이즈는 필수입니다."),
	productGender: z.string().min(1, "분류는 필수입니다."),
	productStyles: z.array(z.string()).min(1, "최소 하나의 스타일이 필요합니다."),
	productName: z.string().min(1, "상품 이름은 필수입니다."),
	productHeight: z.string(),
	brandId: z.string(),
});

export async function uploadProduct(
	otherData: any,
	formData: FormData
): Promise<IResponse> {
	try {
		const data = {
			productImages: otherData.getAll("images") as File[],
			productType: otherData.get("selectedType") || ("" as string),
			productSize: otherData.get("selectedSize") || ("" as string),
			productGender: otherData.get("selectedGender") || ("" as string),
			productStyles: otherData.getAll("selectedStyles") as string[],
			productName: formData.get("productName") as string,
			productHeight: formData.get("height") as string,
			brandId: otherData.get("brandId") as string,
		};

		console.log(data);

		const parsedData = productSchema.parse(data);

		const imageUploadPromises = parsedData.productImages.map(async (image) => {
			const storageRef = ref(storage, `products/${image.name}`);
			await uploadBytes(storageRef, image);
			const downloadUrl = await getDownloadURL(storageRef);
			return downloadUrl;
		});

		const imageUrls = await Promise.all(imageUploadPromises);

		// 추후에 브랜드 이름도 같이 포함되어야 함

		const brandRef = doc(fireStore, COLLECTION_NAME_USER, parsedData.brandId);
		const brandSnap = (await getDoc(brandRef)).data();

		const productData: IProduct = {
			title: parsedData.productName,
			productCategory: parsedData.productType,
			size: parsedData.productSize.toLowerCase(),
			height: parsedData.productHeight,
			genderCategory: parsedData.productGender,
			styleCategory: parsedData.productStyles,
			productImages: imageUrls,
			createdAt: Timestamp.now(),
			brandId: parsedData.brandId,
			brandName: brandSnap!.brandName,
		};

		const docRef = await addDoc(
			collection(fireStore, COLLECTION_NAME_PRODUCT),
			productData
		);

		return {
			status: 200,
			success: true,
			message: "Product uploaded successfully",
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
			console.error("Error uploading product: ", error);
			return {
				status: 500,
				success: false,
				message: "Product upload failed",
			};
		}
	}
}
