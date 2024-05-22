import { fireStore } from "@/config/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Product } from "./page";

export async function getProduct(): Promise<Product[]> {
	const productsCol = collection(fireStore, "Product");

	try {
		const productSnapshot = await getDocs(productsCol);
		const productList = productSnapshot.docs.map((doc) => ({
			id: doc.id,
			...(doc.data() as Omit<Product, "id">),
		}));
		// console.log("Product List : ", productList);
		return productList;
	} catch (error) {
		console.error("Error fetching product documents : ", error);
		return [];
	}
}
