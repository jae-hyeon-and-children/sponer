import { fireStore } from "@/config/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getProduct() {
	const productsCol = collection(fireStore, "Product");

	try {
		const productSnapshot = await getDocs(productsCol);
		const productList = productSnapshot.docs.map((doc) => doc.data());
		// console.log("Product List : ", productList);
		return productList;
	} catch (error) {
		console.error("Error fetching product documents : ", error);
		return [];
	}
}
