"use server";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  getDoc,
  Timestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { fireStore, storage } from "@/config/firebase/firebase";
import { IResponse } from "@/model/responses";
import { IUser, IBrandApplication } from "@/model/user";

export async function uploadBrandUser(
  uid: string,
  formData: FormData
): Promise<IResponse> {
  if (!uid) {
    return {
      status: 400,
      success: false,
      message: "유효하지 않은 사용자입니다.",
    };
  }

  try {
    console.log("Fetching user document:", uid);
    const userDocRef = doc(fireStore, "User", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const existingUserType = userDocSnap.data().userType;
      if (existingUserType === "stylist" || existingUserType === "brand") {
        return {
          status: 400,
          success: false,
          message: `이미 ${existingUserType} 유형의 사용자입니다.`,
        };
      }
    }

    const postalCode = formData.get("postal_code") as string;
    const address = formData.get("address") as string;
    const detailAddress = formData.get("detail_address") as string;
    const extraAddress = formData.get("extra_address") as string;
    const fullAddress = `${postalCode}, ${address}, ${detailAddress}, ${extraAddress}`;
    const profileImageFile = formData.get("profile_photo") as File;
    const certificateImageFile = formData.get("business_photo") as File;
    const phoneNumber = (formData.get("phoneNumber") as string).replace(
      /-/g,
      ""
    );

    let profileImageUrl = "";

    if (profileImageFile && profileImageFile instanceof File) {
      const profileStorage = ref(
        storage,
        `profile_images/${profileImageFile.name}`
      );
      const snapshot = await uploadBytes(profileStorage, profileImageFile);
      profileImageUrl = await getDownloadURL(snapshot.ref);
    }

    let certificateImageUrl = "";

    if (certificateImageFile && certificateImageFile instanceof File) {
      const brandProfileStorage = ref(
        storage,
        `business_certificate_image/${certificateImageFile.name}`
      );
      const brandSnapShot = await uploadBytes(
        brandProfileStorage,
        certificateImageFile
      );
      certificateImageUrl = await getDownloadURL(brandSnapShot.ref);
    }

    const brandFormData: IUser = {
      id: uid,
      profileImage: profileImageUrl,
      businessImageUrl: certificateImageUrl,
      brandName: formData.get("brand_name") as string,
      name: formData.get("name") as string,
      homepage: formData.get("homepage") as string,
      phoneNumber,
      address: fullAddress,
      affiliation: formData.get("affiliation") as string,
      email: formData.get("email") as string,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userType: "brand",
    };

    const approve: IBrandApplication = {
      approve: false,
      brandName: formData.get("brand_name") as string,
      createdAt: Timestamp.now(),
      historyId: "",
      id: "",
    };

    console.log("Setting user document:", brandFormData);
    await setDoc(doc(fireStore, "User", uid), brandFormData);
    await addDoc(collection(fireStore, `/User/${uid}/History`), approve);

    return { status: 200, success: true, message: "사용자 추가 성공" };
  } catch (error) {
    console.error("사용자 업로드 중 오류 발생:", error);
    return { status: 400, success: false, message: "사용자 추가 실패" };
  }
}
