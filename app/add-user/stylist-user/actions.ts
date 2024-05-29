"use server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { fireStore, storage } from "@/config/firebase/firebase";
import { redirect } from "next/navigation";

import { ProviderId, getAuth } from "firebase/auth";

export default async function uploadstylistUser(
  uid: string,
  prevState: { success: undefined; message: "" },
  formData: FormData
) {
  if (!uid) {
    return { success: false, message: "유효하지 않은 사용자입니다." };
  }
  try {
    const postalCode = formData.get("postal_code");
    const address = formData.get("address");
    const detailAddress = formData.get("detail_address");
    const extraAddress = formData.get("extra_address");
    const fullAddress = `${postalCode}, ${address}, ${detailAddress}, ${extraAddress}`;
    const imageFile = formData.get("photo");

    let imageUrl = "";

    if (imageFile && imageFile instanceof File) {
      const profileStorage = ref(storage, `profile_images/${imageFile.name}`);
      const snapshot = await uploadBytes(profileStorage, imageFile);

      imageUrl = await getDownloadURL(snapshot.ref);
    } else {
      console.log("No valid image file found.");
    }

    console.log(imageFile);
    console.log(formData);

    const stylistFormData = {
      profileImage: imageUrl,
      name: formData.get("name"),
      nickName: formData.get("nickname"),
      phoneNumber: formData.get("phone_number"),
      address: fullAddress,
      affiliation: formData.get("affiliation"),
      email: formData.get("email"),
      createdAt: new Date(),
      userType: "stylist",
      // loginType: "loginType",
    };
    console.log("User data: ", stylistFormData);

    await setDoc(doc(fireStore, "User", uid), stylistFormData);

    return { success: true, redirectUrl: "/" };
  } catch (error) {
    console.error("사용자 업로드 중 오류 발생:", error);
    return { success: false, message: "사용자 추가 실패" };
  }
}
