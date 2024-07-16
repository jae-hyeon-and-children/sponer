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
import { z } from "zod";

const profileSchema = z.object({
  profileImage: z.instanceof(File),
  brandName: z.string().min(1, "브랜드 이름은 필수입니다.").optional(),
  phoneNumber: z.string().min(9, "잘못된 전화번호 형식입니다.").max(11),
  name: z.string().min(1, "이름은 필수입니다."),
  homepage: z.string().url().optional(),
  address: z.string().min(1, "주소는 필수입니다."),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  businessImageUrl: z.instanceof(File).optional(),
});

async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

export async function editProfile(
  userId: string,
  formData: FormData
): Promise<IResponse> {
  try {
    const data = {
      profileImage: formData.get("profileImage"),
      brandName: formData.get("brandName"),
      phoneNumber: ((((formData.get("phoneNumber1") as string) +
        formData.get("phoneNumber2")) as string) +
        formData.get("phoneNumber3")) as string,
      name: formData.get("name"),
      homepage: formData.get("homepage"),
      address: `${formData.get("postal_code")}, ${formData.get(
        "address"
      )}, ${formData.get("detail_address")}, ${formData.get("extra_address")}`,
      email: formData.get("email"),
      businessImageUrl: formData.get("businessImageUrl"),
    };

    const parsedData = profileSchema.parse(data);

    const prevUserRef = doc(fireStore, COLLECTION_NAME_USER, userId);
    const docSnap = await getDoc(prevUserRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data() as IUser;

      if (existingData.brandName !== parsedData.brandName) {
        const historyRef = collection(prevUserRef, "History");
        const historyData = {
          approve: false,
          brandName: parsedData.brandName,
          createdAt: Timestamp.now(),
        };
        await addDoc(historyRef, historyData);
        console.log(
          "Brand Name has Changed From, ",
          existingData.brandName,
          "to",
          parsedData.brandName
        );
      }

      const profileImageUrl = parsedData.profileImage
        ? await uploadFile(
            parsedData.profileImage,
            `profile_images/${parsedData.profileImage.name}`
          )
        : existingData.profileImage;
      const businessImageUrl = parsedData.businessImageUrl
        ? await uploadFile(
            parsedData.businessImageUrl,
            `business_certificate_image/${parsedData.businessImageUrl.name}`
          )
        : existingData.businessImageUrl;

      const userData: Partial<IUser> = {
        profileImage: profileImageUrl || existingData.profileImage,
        // brandName: parsedData.brandName || existingData.brandName,
        phoneNumber: parsedData.phoneNumber,
        name: parsedData.name,
        homepage: parsedData.homepage || existingData.homepage,
        address: parsedData.address,
        businessImageUrl: businessImageUrl || existingData.businessImageUrl,
        updatedAt: Timestamp.now(),
      };

      const userRef = doc(fireStore, COLLECTION_NAME_USER, userId);
      await updateDoc(userRef, userData);

      return {
        status: 200,
        success: true,
        message: "Profile updated successfully",
      };
    } else {
      return {
        status: 404,
        success: false,
        message: "User not found",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error:", error.errors);
      return {
        status: 400,
        success: false,
        message: "Validation error",
        errors: error.errors.map((e) => ({ path: e.path, message: e.message })),
      };
    } else {
      console.error("Error updating profile: ", error);
      return {
        status: 500,
        success: false,
        message: "Profile update failed",
      };
    }
  }
}

// export async function getUserById(userId: string): Promise<IUser | null> {
//   try {
//     const docRef = doc(fireStore, COLLECTION_NAME_USER, userId);
//     console.log("Fetching document with ID:", userId);

//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       console.log("Document data:", docSnap.data());
//       const data = docSnap.data();

//       if (data.profileImage) {
//         const profileFileName = getFileNameFromUrl(
//           data.profileImage,
//           "profile"
//         );
//         const base64 = await urlToBase64(data.profileImage);
//         data.profileImage = `data:image/jpeg;base64,${base64}`;

//         data.profileFileName = profileFileName;
//       }

//       if (data.businessImageUrl) {
//         const businessFileName = getFileNameFromUrl(
//           data.businessImageUrl,
//           "business"
//         );

//         const base64 = await urlToBase64(data.businessImageUrl);
//         data.businessImageUrl = `data:image/jpeg;base64,${base64}`;

//         data.businessFileName = businessFileName;
//       }

//       return data as IUser;
//     } else {
//       console.log("No such document!");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching document:", error);
//     return null;
//   }
// }

export async function getUserById(userId: string): Promise<IUser | null> {
  try {
    const docRef = doc(fireStore, "User", userId);
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
      console.log("파베에서 못찾음");
      // 유저 데이터가 없는 경우 기본 값을 설정
      return {
        id: userId,
        userType: "",
      } as IUser;
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
