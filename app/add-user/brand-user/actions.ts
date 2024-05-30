"use server";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { fireStore, storage } from "@/config/firebase/firebase";

export default async function uploadbrandUser(
  uid: string,
  prevState: any,
  formData: FormData
) {
  if (!uid) {
    return {
      status: 400,
      success: false,
      message: "유효하지 않은 사용자입니다.",
    };
  }
  try {
    const postalCode = formData.get("postal_code");
    const address = formData.get("address");
    const detailAddress = formData.get("detail_address");
    const extraAddress = formData.get("extra_address");
    const fullAddress = `${postalCode}, ${address}, ${detailAddress}, ${extraAddress}`;
    const profileImageFile = formData.get("profile_photo");
    const certificateImageFile = formData.get("business_photo");

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

    const brandFormData = {
      profileImage: profileImageUrl,
      businessImageUrl: certificateImageUrl,
      brandName: formData.get("brand_name"),
      name: formData.get("name"),
      homepage: formData.get("homepage"),
      phoneNumber: ((((formData.get("phoneNumber1") as string) +
        formData.get("phoneNumber2")) as string) +
        formData.get("phoneNumber3")) as string,
      address: fullAddress,
      affiliation: formData.get("affiliation"),
      email: formData.get("email"),
      createdAt: new Date(),
      userType: "brand",
    };

    console.log("User data: ", brandFormData);

    const approve = {
      approve: false,
      brandName: formData.get("brand_name"),
      createdAt: new Date(),
      reason: false,
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
