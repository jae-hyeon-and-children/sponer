"use server";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/config/firebase/firebase";

async function addUserTypeToUser(userId: string, userType: string) {
  const userDocRef = doc(db, "User", userId);

  try {
    await updateDoc(userDocRef, {
      userType: userType,
    });
    console.log("유저타입 추가 성공");
  } catch (error) {
    console.error("Error updating user type: ", error);
  }
}

export default async function uploadbrabdUser(
  prevState: any,
  formData: FormData
) {
  try {
    const postalCode = formData.get("postal_code");
    const address = formData.get("address");
    const detailAddress = formData.get("detail_address");
    const extraAddress = formData.get("extra_address");

    const fullAddress = `${postalCode}, ${address}, ${detailAddress}, ${extraAddress}`;
    const profileImageFile = formData.get("profile_photo");
    const certificateImageFile = formData.get("certificate_photo");

    let profileImageUrl = "";
    let certificateImageUrl = "";

    if (profileImageFile && profileImageFile instanceof File) {
      const storageRef = ref(
        storage,
        `profile_images/${profileImageFile.name}`
      );
      const snapshot = await uploadBytes(storageRef, profileImageFile);
      profileImageUrl = await getDownloadURL(snapshot.ref);
    } else {
      console.log("No valid profile image file found.");
    }

    if (certificateImageFile && certificateImageFile instanceof File) {
      const storageRef = ref(
        storage,
        `business_certificate_images/${certificateImageFile.name}`
      );
      const snapshot = await uploadBytes(storageRef, certificateImageFile);
      certificateImageUrl = await getDownloadURL(snapshot.ref);
    } else {
      console.log("No valid certificate image file found.");
    }

    const data = {
      profile_image: profileImageUrl,
      certificate_image: certificateImageUrl,
      brand_name: formData.get("brand_name"),
      name: formData.get("name"),
      homepage: formData.get("homepage"),
      phone_number: formData.get("phone_number"),
      address: fullAddress,
      affiliation: formData.get("affiliation"),
      email: formData.get("email"),
      createdAt: new Date(),
      userType: "brand",
    };
    console.log(data);

    // Firestore에 데이터 추가
    const userDocRef = await addDoc(collection(db, "User"), data);

    // 사용자 유형 추가
    await addUserTypeToUser(userDocRef.id, "brand");

    return { success: true, message: "사용자가 성공적으로 추가되었습니다." };
  } catch (error) {
    console.error("사용자 업로드 중 오류 발생:", error);
    return { success: false, message: "사용자 추가 실패" };
  }
}
