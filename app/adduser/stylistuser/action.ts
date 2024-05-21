"use server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/config/firebase/firebase";

async function addUserTypeToUser(userId: string, userType: string) {
  const userDocRef = doc(db, "User", userId);

  try {
    await updateDoc(userDocRef, { userType: userType });
    console.log("유저타입 추가 성공");
  } catch (error) {
    console.error("Error updating user type: ", error);
  }
}

export default async function uploadstylistUser(
  prevState: any,
  formData: FormData
) {
  try {
    const postalCode = formData.get("postal_code");
    const address = formData.get("address");
    const detailAddress = formData.get("detail_address");
    const extraAddress = formData.get("extra_address");
    const fullAddress = `${postalCode}, ${address}, ${detailAddress}, ${extraAddress}`;
    const imageFile = formData.get("photo");
    let imageUrl = "";

    if (imageFile && imageFile instanceof File) {
      const storageRef = ref(storage, `profile_images/${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);

      imageUrl = await getDownloadURL(snapshot.ref);
    } else {
      console.log("No valid image file found.");
    }

    const data = {
      profile_image: imageUrl,
      name: formData.get("name"),
      nickname: formData.get("nickname"),
      phone_number: formData.get("phone_number"),
      address: fullAddress,
      affiliation: formData.get("affiliation"),
      email: formData.get("email"),
      createdAt: new Date(),
      userType: "stylist",
    };
    console.log("User data: ", data);

    const userDocRef = await addDoc(collection(db, "User"), data);

    await addUserTypeToUser(userDocRef.id, "stylist");

    return { success: true, message: "사용자가 성공적으로 추가되었습니다." };
  } catch (error) {
    console.error("사용자 업로드 중 오류 발생:", error);
    return { success: false, message: "사용자 추가 실패" };
  }
}
