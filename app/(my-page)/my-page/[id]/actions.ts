"use server";

import { auth, fireStore, storage } from "@/config/firebase/firebase";
import {
  COLLECTION_NAME_PRODUCT,
  COLLECTION_NAME_USER,
} from "@/constants/variables";
import { urlToBase64 } from '@/libs/utils/format';

import { getFileNameFromUrl } from "@/libs/utils/image";
import { IResponse } from "@/model/responses";
import { IBrandApplication, IUser } from "@/model/user";
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
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { z } from "zod";

const profileSchema = z.object({
  profileImage: z.instanceof(File),
  brandName: z
    .string()
    .min(1, "브랜드 이름은 필수입니다.")
    .nullable()
    .optional(),
  phoneNumber: z.string().min(9, "잘못된 전화번호 형식입니다.").max(11),
  name: z.string().min(1, "이름은 필수입니다."),
  homepage: z.string().nullable().optional(),
  address: z.string().refine(
    (value) => {
      return value.replace(/,/g, "").trim().length > 0;
    },
    {
      message: "주소는 필수입니다.",
    }
  ),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  businessImageUrl: z.instanceof(File).nullable().optional(),
  affiliation: z.string().min(1, "소속은 필수입니다.").optional(),
  nickName: z.string().optional(),
});

type ProfileData = {
  profileImage: FormDataEntryValue | null;
  phoneNumber: string;
  name: FormDataEntryValue | null;
  homepage: FormDataEntryValue | null;
  address: string;
  email: FormDataEntryValue | null;
  brandName?: FormDataEntryValue | null;
  businessImageUrl?: FormDataEntryValue | null;
  affiliation?: FormDataEntryValue | null;
  nickName?: FormDataEntryValue | null;
};

async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

// async function uploadFile(file: File, path: string): Promise<string> {
//   try {
//     const storageRef = ref(storage, path);
//     console.log(`Uploading file to path: ${path}`);
//     await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(storageRef);
//     console.log(`File uploaded successfully: ${downloadURL}`);
//     return downloadURL;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     throw error; // 에러를 발생시켜 상위에서 잡을 수 있게 합니다.
//   }
// }

// 사용자 승인 함수
export async function approveBrand(userId: string, historyId: string) {
  try {
    const userRef = doc(fireStore, COLLECTION_NAME_USER, userId);
    // 특정 History 문서 참조
    const historyDocRef = doc(userRef, "History", historyId);

    // 특정 historyId에 해당하는 문서 가져오기
    const historyDoc = await getDoc(historyDocRef);

    if (historyDoc.exists()) {
      const historyData = historyDoc.data();

      // 해당 문서 승인 처리
      await updateDoc(historyDocRef, { approve: true });

      // User 컬렉션의 brandName 업데이트
      await updateDoc(userRef, { brandName: historyData.brandName });
    } else {
      console.error("No such document in History!");
    }
  } catch (error) {
    console.error("Error approving brand:", error);
  }
}

// 사용자 거절 함수
export async function rejectBrand(
  userId: string,
  historyId: string,
  reason: string
) {
  try {
    const userRef = doc(fireStore, COLLECTION_NAME_USER, userId);
    // 특정 History 문서 참조
    const historyRef = doc(userRef, "History", historyId);
    // 해당 문서만 업데이트
    await updateDoc(historyRef, { approve: false, reason });
  } catch (error) {
    console.error("Error rejecting brand:", error);
  }
}

// 신청 이력 조회 함수
export async function getPendingBrandUsers(): Promise<IUser[]> {
  try {
    const usersRef = collection(fireStore, COLLECTION_NAME_USER);
    const q = query(usersRef, where("userType", "==", "brand"));

    const querySnapshot = await getDocs(q);
    const users: IUser[] = [];

    for (const doc of querySnapshot.docs) {
      const userData = doc.data() as IUser;
      // 사용자 ID 설정
      userData.id = doc.id;
      const historyRef = collection(doc.ref, "History");

      const historyQuery = query(
        historyRef,
        where("approve", "==", false),
        orderBy("createdAt", "desc")
      );

      const historySnapshot = await getDocs(historyQuery);

      if (historySnapshot.empty) continue;

      // 아직 처리되지 않은 항목들만 필터링하고 IBrandApplication 형식으로 변환
      const pendingHistory = historySnapshot.docs
        .filter(
          (historyDoc) =>
            !historyDoc.data().approve && !historyDoc.data().reason
        )
        .map((historyDoc) => {
          const data = historyDoc.data();
          return {
            historyId: historyDoc.id,
            id: data.id || "", // 기본값 설정 또는 필요시 해당 값을 추가
            approve: data.approve,
            brandName: data.brandName,
            createdAt: data.createdAt,
            reason: data.reason,
          } as IBrandApplication;
        });

      if (pendingHistory.length > 0) {
        userData.history = pendingHistory;
        users.push(userData);
      }
    }

    return users;
  } catch (error) {
    console.error("Error fetching pending brand users:", error);
    return [];
  }
}

export async function editProfile(
  userId: string,
  formData: FormData
): Promise<IResponse> {
  try {
    const data: ProfileData = {
      profileImage: formData.get("profileImage"),
      phoneNumber: (formData.get("phoneNumber") as string).replace(/-/g, ""),
      name: formData.get("name"),
      homepage: formData.get("homepage") || "없음",
      address: `${formData.get("postal_code") || ""}, ${
        formData.get("address") || ""
      }, ${formData.get("detail_address") || ""}, ${
        formData.get("extra_address") || ""
      }`,
      email: formData.get("email"),
    };

    const brandName = formData.get("brandName");
    const businessImageUrl = formData.get("businessImageUrl");
    const affiliation = formData.get("affiliation");
    const nickName = formData.get("nickName");

    if (brandName) {
      data.brandName = brandName;

      data.businessImageUrl = businessImageUrl;
    } else {
      data.affiliation = affiliation;

      data.nickName = nickName;
    }

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

      let userData: Partial<IUser> = {};

      if (brandName) {
        userData = {
          profileImage: profileImageUrl || existingData.profileImage,
          phoneNumber: parsedData.phoneNumber,
          name: parsedData.name,
          homepage: parsedData.homepage || existingData.homepage,
          address: parsedData.address,
          businessImageUrl: businessImageUrl || existingData.businessImageUrl,
          updatedAt: Timestamp.now(),
        };
      } else {
        userData = {
          profileImage: profileImageUrl || existingData.profileImage,
          nickName: parsedData.nickName || existingData.nickName,
          affiliation: parsedData.affiliation || existingData.affiliation,
          phoneNumber: parsedData.phoneNumber,
          name: parsedData.name,
          homepage: parsedData.homepage || existingData.homepage,
          address: parsedData.address,
          updatedAt: Timestamp.now(),
        };
      }

      console.log("Updating user with data:", userData);

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

export async function getUserById(userId: string): Promise<IUser | null> {
  try {
    const docRef = doc(fireStore, COLLECTION_NAME_USER, userId);
    console.log("Fetching document with ID:", userId);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const data = docSnap.data();

      // 이미지 처리 로직
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

      // history 컬렉션에서 최신의 approve 상태 확인
      const historyRef = collection(docRef, "History");
      const historyQuery = query(
        historyRef,
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const historySnapshot = await getDocs(historyQuery);
      let latestApproveStatus = false;

      if (!historySnapshot.empty) {
        const latestHistory =
          historySnapshot.docs[0].data() as IBrandApplication;
        latestApproveStatus = latestHistory.approve;
        console.log("Latest approve status from history:", latestApproveStatus);
      }

      // approve 상태를 history 컬렉션의 최신 상태로 반영
      return {
        ...data,
        approve: latestApproveStatus,
      } as IUser;
    } else {
      // 문서가 존재하지 않을 경우 기본 사용자 객체 반환
      console.log("No such document, creating default user data");
      const defaultUser: IUser = {
        id: userId,
        name: "",
        profileImage: "",
        email: "",
        address: "",
        phoneNumber: "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        userType: "",
        approve: false, // 기본값 설정
      };
      return defaultUser;
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
