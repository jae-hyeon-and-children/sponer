import { fireStore } from "@/config/firebase/firebase";
import {
	COLLECTION_NAME_PRODUCT,
	COLLECTION_NAME_USER,
} from "@/constants/variables";
import {
	collection,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	updateDoc,
	where,
} from "@firebase/firestore";

export async function approveBrand(brandId: string) {
	const userRef = doc(fireStore, COLLECTION_NAME_USER, brandId);
	const historyRef = collection(userRef, "History");

	const q = query(historyRef, orderBy("createdAt", "desc"), limit(1));
	const querySnapshot = await getDocs(q);

	if (!querySnapshot.empty) {
		const latestDoc = querySnapshot.docs[0];
		await updateDoc(latestDoc.ref, {
			approve: true,
		});

		const productsRef = collection(fireStore, COLLECTION_NAME_PRODUCT);
		const productsQuery = query(productsRef, where("brandId", "==", brandId));
		const productsSnapshot = await getDocs(productsQuery);

		console.log(productsSnapshot.docs);

		const updatePromises = productsSnapshot.docs.map((productDoc) => {
			updateDoc(productDoc.ref, { brandName: latestDoc.data().brandName });
		});

		await Promise.all(updatePromises);

		await updateDoc(userRef, { brandName: latestDoc.data().brandName });
	}
}
