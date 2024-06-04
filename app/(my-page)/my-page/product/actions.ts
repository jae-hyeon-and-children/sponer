"use server";

import { fireStore, storage } from "@/config/firebase/firebase";
import { COLLECTION_NAME_PRODUCT } from "@/constants/variables";
import { IProduct } from "@/model/product";
import { IResponse } from "@/model/responses";
import { initializeApp } from "firebase/app";
import {
	Timestamp,
	addDoc,
	collection,
	getFirestore,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { redirect } from "next/navigation";

export async function uploadProduct(otherData: any, formData: FormData) {
	const data = {
		productImages: otherData.getAll("images") as File[],
		productType: otherData.get("selectedType") as string,
		productSize: otherData.get("selectedSize") as string,
		productGender: otherData.get("selectedGender") as string,
		productStyles: otherData.getAll("selectedStyles") as string[],
		productName: formData.get("productName") as string,
		productHeight: formData.get("height") as string,
		brandId: otherData.get("brandId") as string,
	};

	try {
		const imageUploadPromises = data.productImages.map(async (image) => {
			const storageRef = ref(storage, `products/${image.name}`);
			await uploadBytes(storageRef, image);
			const downloadUrl = await getDownloadURL(storageRef);
			return downloadUrl;
		});

		const imageUrls = await Promise.all(imageUploadPromises);

		// 추후에 브랜드 이름도 같이 포함되어야 함

		const productData: IProduct = {
			title: data.productName,
			productCategory: data.productType,
			size: data.productSize,
			height: data.productHeight,
			genderCategory: data.productGender,
			styleCategory: data.productStyles,
			productImages: imageUrls,
			createdAt: Timestamp.now(),
			brandId: data.brandId,
		};

		const docRef = await addDoc(
			collection(fireStore, COLLECTION_NAME_PRODUCT),
			productData
		);

		const response: IResponse = {
			status: 200,
			success: true,
			message: "Product uploaded successfully",
		};

		return response;
	} catch (error) {
		console.error("Error uploading product : ", error);

		const response: IResponse = {
			status: 400,
			success: false,
			message: "Product uploaded failed",
		};

		return response;
	}
}
