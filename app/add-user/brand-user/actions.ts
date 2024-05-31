"use server";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import { fireStore, storage } from "@/config/firebase/firebase";
import { IResponse } from "@/model/responses";
import { IBrandApprove, IUser } from "@/model/user";

export default async function uploadbrandUser(
  uid: string,
  prevState: any,
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
    const postalCode = formData.get("postal_code") as string;
    const address = formData.get("address") as string;
    const detailAddress = formData.get("detail_address") as string;
    const extraAddress = formData.get("extra_address") as string;
    const fullAddress = `${postalCode}, ${address}, ${detailAddress}, ${extraAddress}`;
    const profileImageFile = formData.get("profile_photo") as File;
    const certificateImageFile = formData.get("business_photo") as File;

    let profileImageUrl = "";

    if (profileImageFile && profileImageFile instanceof File) {
      const profileStorage = ref(
        storage,
        `profile_images/${profileImageFile.name}`
      );
      const snapshot = await uploadBytes(profileStorage, profileImageFile);
      profileImageUrl = await getDownloadURL(snapshot.ref);
    } else {
      console.log("not found : ", profileImageUrl);
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
    } else {
      console.log("not found : ", certificateImageUrl);
    }

    console.log(profileImageUrl, certificateImageUrl);
    console.log(formData);

    const brandFormData: IUser = {
      profileImage: profileImageUrl,
      businessImageUrl: certificateImageUrl,
      brandName: formData.get("brand_name") as string,
      name: formData.get("name") as string,
      homepage: formData.get("homepage") as string,
      phoneNumber: ((((formData.get("phoneNumber1") as string) +
        formData.get("phoneNumber2")) as string) +
        formData.get("phoneNumber3")) as string,
      address: fullAddress,
      affiliation: formData.get("affiliation") as string,
      email: formData.get("email") as string,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userType: "brand",
    };

    console.log("User data: ", brandFormData);

    const approve: IBrandApprove = {
      approve: false,
      brandName: formData.get("brand_name") as string,
      createdAt: Timestamp.now(),
    };

    console.log("Brand approve: ", approve);

    await setDoc(doc(fireStore, "User", uid), brandFormData);
    await addDoc(collection(fireStore, `/User/${uid}/History`), approve);

    return { status: 200, success: true };
  } catch (error) {
    console.error("사용자 업로드 중 오류 발생:", error);
    return { status: 400, success: false, message: "사용자 추가 실패" };
  }
}
