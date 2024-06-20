// import { fireStore } from "@/config/firebase/firebase";
// import { IUser } from "@/model/user";
// import { User } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// export const getUserData = async (user: User): Promise<IUser | null> => {
//   const userDoc = await getDoc(doc(fireStore, "users", user.uid));
//   if (userDoc.exists()) {
//     return userDoc.data() as IUser;
//   }
//   return null;
// };
