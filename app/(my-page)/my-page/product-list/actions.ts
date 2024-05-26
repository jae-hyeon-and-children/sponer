"use server";
import { fireStore } from "@/config/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { IProduct } from "@/model/product";
import { COLLECTION_NAME_PRODUCT } from "@/constants/variables";

export async function getProduct(): Promise<IProduct[]> {
	const productsCol = collection(fireStore, COLLECTION_NAME_PRODUCT);

	try {
		const productSnapshot = await getDocs(productsCol);
		const productList = productSnapshot.docs.map((doc) => ({
			id: doc.id,
			...(doc.data() as Omit<IProduct, "id">),
		}));
		// console.log("Product List : ", productList);
		return productList;
	} catch (error) {
		console.error("Error fetching product documents : ", error);
		return [];
	}
}
