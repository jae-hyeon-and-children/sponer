"use server";

import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export async function uploadProduct(formData: FormData) {
	const data = {
		productImages: formData.getAll("images") as File[],
		productName: formData.get("productName") as string,
		productType: formData.get("selectedType") as string,
		productSize: formData.get("selectedSize") as string,
		productHeight: formData.get("height") as string,
		productGender: formData.get("selectedGender") as string,
		productStyles: formData.getAll("selectedStyles") as string[],
	};

	console.log(data);

	try {
		const imageUploadPromises = data.productImages.map(async (image) => {
			const storageRef = ref(storage, `products/${image.name}`);
			await uploadBytes(storageRef, image);
			const downloadUrl = await getDownloadURL(storageRef);
			return downloadUrl;
		});

		const imageUrls = await Promise.all(imageUploadPromises);

		const productData = {
			title: data.productName,
			product_category: data.productType,
			size: data.productSize,
			height: data.productHeight,
			gender_category: data.productGender,
			style_category: data.productStyles,
			productImages: imageUrls,
			createdAt: new Date(),
		};

		const docRef = await addDoc(collection(db, "Product"), productData);

		return {
			success: true,
			message: "Product uploaded successfully..!",
		};
	} catch (error) {
		console.error("Error uploading product : ", error);
		return {
			success: false,
			message: "Failed to upload product",
		};
	}
}
