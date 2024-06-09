"use server";

import { auth, fireStore, storage } from "@/config/firebase/firebase";
import { COLLECTION_NAME_USER } from "@/constants/variables";
import { urlToBase64 } from "@/libs/utils/format";
import { getFileNameFromUrl } from "@/libs/utils/image";
import { IResponse } from "@/model/responses";
import { IUser } from "@/model/user";
import {
	deleteUser as deleteAuthUser,
	deleteUser,
	getAuth,
} from "firebase/auth";
import {
	Timestamp,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	updateDoc,
	writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { redirect } from "next/navigation";

async function uploadFile(file: File, path: string): Promise<string> {
	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, file);
	const downloadURL = await getDownloadURL(storageRef);
	return downloadURL;
}

export async function editProfile(userId: string, formData: FormData) {
	const data = {
		profileImage: formData.get("profileImage") as File,
		brandName: formData.get("brandName") as string,
		phoneNumber: ((((formData.get("phoneNumber1") as string) +
			formData.get("phoneNumber2")) as string) +
			formData.get("phoneNumber3")) as string,
		name: formData.get("name") as string,
		homepage: formData.get("homepage") as string,
		address: `${formData.get("postal_code")}, ${formData.get(
			"address"
		)}, ${formData.get("detail_address")}, ${formData.get("extra_address")}`,
		email: formData.get("email") as string,
		businessImageUrl: formData.get("businessImageUrl") as File,
	};

	console.log(data.businessImageUrl);

	try {
		const prevUserRef = doc(fireStore, COLLECTION_NAME_USER, userId);
		const docSnap = await getDoc(prevUserRef);

		if (docSnap.exists()) {
			const existingData = docSnap.data() as IUser;

			if (existingData.brandName !== data.brandName) {
				const historyRef = collection(prevUserRef, "History");
				const historyData = {
					approve: false,
					brandName: data.brandName,
					createdAt: Timestamp.now(),
				};
				await addDoc(historyRef, historyData);
				console.log(
					"Brand Name has Changed From, ",
					existingData.brandName,
					"to",
					data.brandName
				);
			}
		}

		const profileImageUrl =
			typeof data.profileImage === "string"
				? data.profileImage
				: await uploadFile(
						data.profileImage,
						`profile_images/${data.profileImage.name}`
				  );
		const businessImageUrl =
			typeof data.businessImageUrl === "string"
				? data.businessImageUrl
				: await uploadFile(
						data.businessImageUrl,
						`business_certificate_image/${data.businessImageUrl.name}`
				  );

		const userData: Partial<IUser> = {
			profileImage: profileImageUrl,
			brandName: data.brandName,
			phoneNumber: data.phoneNumber,
			name: data.name,
			homepage: data.homepage,
			address: data.address,
			businessImageUrl: businessImageUrl,
			updatedAt: Timestamp.now(),
		};

		const userRef = doc(fireStore, COLLECTION_NAME_USER, userId);
		await updateDoc(userRef, userData);

		const response: IResponse = {
			status: 200,
			success: true,
			message: "Profile updated successfully",
		};

		return response;
	} catch (error) {
		console.error("Error updating profile: ", error);
		const response: IResponse = {
			status: 400,
			success: false,
			message: "Profile updated successfully",
		};

		return response;
	}
}

export async function getUserById(userId: string): Promise<IUser | null> {
	try {
		const docRef = doc(fireStore, COLLECTION_NAME_USER, userId);
		console.log("Fetching document with ID:", userId);

		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log("Document data:", docSnap.data());
			const data = docSnap.data();

			if (data.profileImage) {
				const profileFileName = getFileNameFromUrl(
					data.profileImage,
					"profile"
				);
				const base64 = await urlToBase64(data.profileImage);
				data.profileImage = `data:image/jpeg;base64,${base64}`;

				data.profileFileName = profileFileName;
			}

			if (data.businessImageUrl) {
				const businessFileName = getFileNameFromUrl(
					data.businessImageUrl,
					"business"
				);

				const base64 = await urlToBase64(data.businessImageUrl);
				data.businessImageUrl = `data:image/jpeg;base64,${base64}`;

				data.businessFileName = businessFileName;
			}

			return data as IUser;
		} else {
			console.log("No such document!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching document:", error);
		return null;
	}
}

export async function isUserTypeBrand(userId: string): Promise<boolean> {
	"use server";
	if (!userId) return false;

	try {
		const userRef = doc(fireStore, "User", userId);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();
			return userData.userType === "brand";
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}

async function deleteCollection(docRef: any, collectionName: string) {
	const collectionRef = collection(docRef, collectionName);
	const snapshot = await getDocs(collectionRef);

	const batch = writeBatch(fireStore);
	snapshot.docs.forEach((doc) => {
		batch.delete(doc.ref);
	});

	await batch.commit();
}

export async function deleteUserData(uid: string) {
	try {
		const userDocRef = doc(fireStore, COLLECTION_NAME_USER, uid);

		// Delete the History collection
		await deleteCollection(userDocRef, "History");

		// Delete the User document
		await deleteDoc(userDocRef);

		// Delete the user from Firebase Authentication
		const auth = getAuth();
		const user = auth.currentUser;

		if (user) {
			deleteUser(user)
				.then(() => {
					// User deleted.
				})
				.catch((error) => {
					console.log(error);
				});
		}

		const response: IResponse = {
			status: 200,
			success: true,
			message: "User Data Deleted",
		};

		return response;
	} catch (error) {
		const response: IResponse = {
			status: 400,
			success: false,
			message: "User Data Deleted Failed",
		};

		return response;
	}
}
