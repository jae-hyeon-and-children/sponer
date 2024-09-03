// adminpage에서 admin 유저 체크

import { fireStore } from "@/config/firebase/firebase";
import { COLLECTION_NAME_USER } from "@/constants/variables";
import { doc, getDoc } from "firebase/firestore";

export async function isUserTypeAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;

  try {
    const userRef = doc(fireStore, COLLECTION_NAME_USER, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.userType === "admin";
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    return false;
  }
}
