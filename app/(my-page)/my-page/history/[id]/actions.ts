"use server";

import { fireStore, storage } from "@/config/firebase/firebase";
import { COLLECTION_NAME_USER } from "@/constants/variables";
import { urlToBase64 } from "@/libs/utils/format";
import { IHistory, IUser } from "@/model/user";
import {
	DocumentData,
	Timestamp,
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { redirect } from "next/navigation";

export async function getHistoryById(userId: string): Promise<IHistory[]> {
	try {
		const userRef = doc(fireStore, COLLECTION_NAME_USER, userId);
		const historyRef = collection(userRef, "History");
		const querySnapshot = await getDocs(historyRef);

		const historyData: IHistory[] = querySnapshot.docs.map((doc) => {
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
			} as IHistory;
		});

		return historyData;
	} catch (error) {
		console.error("Error fetching history:", error);
		return [];
	}
}
