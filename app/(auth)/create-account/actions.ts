import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { IResponse } from "@/model/responses";

export default async function createaccount(
  prevState: any,
  formData: FormData
): Promise<IResponse> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return {
      status: 400,
      success: false,
      message: "Email and password are required",
    };
  }

  try {
    const createUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(createUser.user, {});

    return {
      status: 200,
      success: true,
      message: "성공적으로 회원가입 되셨습니다.",
    };
  } catch (e) {
    if (e instanceof FirebaseError) {
      return {
        status: 500,
        success: false,
        message: "올바른 형식이 아닙니다. 비밀번호는 최소6자이상 이여야 합니다",
      };
    }
    return {
      status: 500,
      success: false,
      message: "예상치 못한 에러가 발생했습니다.",
    };
  }
}
