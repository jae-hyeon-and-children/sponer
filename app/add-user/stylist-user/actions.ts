import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { fireStore, storage } from "@/config/firebase/firebase";
import { IResponse } from "@/model/responses";
import { IUser } from "@/model/user";

export default async function uploadstylistUser(
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
    const imageFile = formData.get("photo") as File;

    let imageUrl = "";

    if (imageFile) {
      const profileStorage = ref(storage, `profile_images/${imageFile.name}`);
      const snapshot = await uploadBytes(profileStorage, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    } else {
      console.log("No valid image file found.");
    }

    const stylistFormData: IUser = {
      profileImage: imageUrl,
      name: formData.get("name") as string,
      nickName: formData.get("nickname") as string,
      phoneNumber: ((((formData.get("phoneNumber1") as string) +
        formData.get("phoneNumber2")) as string) +
        formData.get("phoneNumber3")) as string,
      address: fullAddress,
      affiliation: formData.get("affiliation") as string,
      email: formData.get("email") as string,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userType: "stylist",
    };
    console.log("User data: ", stylistFormData);

    await setDoc(doc(fireStore, "User", uid), stylistFormData);

    return { status: 200, success: true, message: "사용자 추가 성공" };
  } catch (error) {
    console.error("사용자 업로드 중 오류 발생:", error);
    return { status: 400, success: false, message: "사용자 추가 실패" };
  }
}
