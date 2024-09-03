"use server";

import { fireStore, storage } from "@/config/firebase/firebase";
import { COLLECTION_NAME_USER } from "@/constants/variables";
import { urlToBase64 } from "@/libs/utils/format";
import { IBrandApplication, IUser } from "@/model/user";
import {
	DocumentData,
	Timestamp,
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	updateDoc,
} from "firebase/firestore";

export async function getHistoryById(
	userId: string
): Promise<IBrandApplication[]> {
	try {
		const userRef = doc(fireStore, COLLECTION_NAME_USER, userId);
		const historyRef = collection(userRef, "History");

		// 쿼리를 사용하여 createdAt 기준으로 정렬
		const q = query(historyRef, orderBy("createdAt", "desc"));
		const querySnapshot = await getDocs(q);

		const historyData: IBrandApplication[] = querySnapshot.docs.map((doc) => {
			const data = doc.data() as DocumentData;

			const createdAt = data.createdAt;

			let timestamp: Timestamp;
			if (createdAt instanceof Timestamp) {
				timestamp = createdAt;
			} else if (createdAt && createdAt.seconds) {
				timestamp = new Timestamp(createdAt.seconds, createdAt.nanoseconds);
			} else {
				timestamp = Timestamp.fromDate(new Date()); // 기본값으로 현재 시간을 설정하거나 다른 적절한 기본값 설정
			}

			return {
				approve: data.approve,
				brandName: data.brandName,
				createdAt: timestamp,
				reason: data.reason,
			} as IBrandApplication;
		});

		return historyData;
	} catch (error) {
		console.error("Error fetching history:", error);
		return [];
	}
}
