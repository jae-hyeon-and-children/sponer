"use server";
import { fireStore } from "@/config/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { IProduct, ProductConverter } from "@/model/product";
import { COLLECTION_NAME_PRODUCT } from "@/constants/variables";

export async function getProduct(id: string): Promise<IProduct[]> {
	const productsCol = collection(fireStore, COLLECTION_NAME_PRODUCT);
	const q = query(productsCol, where("brandId", "==", id));

	try {
		const productSnapshot = await getDocs(q);
		const productList = [];

		for (const product of productSnapshot.docs) {
			const convertedProduct = ProductConverter.fromFirestore(product);
			productList.push(convertedProduct);
		}

		return productList;
	} catch (error) {
		console.error("Error fetching product documents : ", error);
		return [];
	}
}
