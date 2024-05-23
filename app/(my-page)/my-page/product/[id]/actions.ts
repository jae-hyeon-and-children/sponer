import { fireStore } from "@/config/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Product } from "../../product-list/page";

export async function getProductById(
	productId: string
): Promise<Product | null> {
	try {
		const docRef = doc(fireStore, "Product", productId);
		console.log("Fetching document with ID:", productId);

		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
			return { id: docSnap.id, ...docSnap.data() } as Product;
		} else {
			console.log("No such document!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching document:", error);
		return null;
	}
}
