"use server";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "@/config/firebase/firebase";

export default async function uploadbrandUser(
  prevState: any,
  formData: FormData
) {
  try {
    const uid = auth.currentUser?.uid;

    const postalCode = formData.get("postal_code");
    const address = formData.get("address");
    const detailAddress = formData.get("detail_address");
    const extraAddress = formData.get("extra_address");
    const fullAddress = `${postalCode}, ${address}, ${detailAddress}, ${extraAddress}`;
    console.log("없다 uid : ", uid);

    // 파일 가져오기
    const profileImageFile = formData.get("profile_photo");
    const certificateImageFile = formData.get("business_photo");

    let profileImageUrl = "";

    if (profileImageFile && profileImageFile instanceof File) {
      const Refstorage = ref(
        storage,
        `profile_images/${profileImageFile.name}`
      );
      const shotsnap = await uploadBytes(Refstorage, profileImageFile);
      profileImageUrl = await getDownloadURL(shotsnap.ref);
    } else {
    }

    let certificateImageUrl = "";

    if (certificateImageFile && certificateImageFile instanceof File) {
      const BrandRefstorage = ref(
        storage,
        `business_certificate_image/${certificateImageFile.name}`
      );
      const Brandshotsnap = await uploadBytes(
        BrandRefstorage,
        certificateImageFile
      );
      certificateImageUrl = await getDownloadURL(Brandshotsnap.ref);
    } else {
    }

    console.log(formData);

    const data = {
      profile_image: profileImageUrl,
      business_certificate_image_url: certificateImageUrl,
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
    console.log("User data: ", data);

    const tada = {
      approve: false,
      brand_name: formData.get("brand_name"),
      created_at: new Date(),
      reason: false,
    };

    console.log("User tada: ", tada);

    // Firestore에 데이터 추가
    await addDoc(collection(db, "User"), data);
    await addDoc(collection(db, `/User/${uid}/History`), tada);
    // 꺽새로 바꿔서 uid 땡겨와서 추가

    return { success: true, message: "사용자가 성공적으로 추가되었습니다." };
  } catch (error) {
    console.error("사용자 업로드 중 오류 발생:", error);
    return { success: false, message: "사용자 추가 실패" };
  }
}
