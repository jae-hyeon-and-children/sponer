"use client";
import { editProfile, getUserById } from "@/app/(my-page)/my-page/[id]/actions";
import Button from "@/components/global/button";
import { IResponse } from "@/model/responses";
import { IUser } from "@/model/user";
import { toastState } from "@/recoil/atoms";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { useRecoilState } from "recoil";
import { base64ToFile } from "../../product/edit-product";
import { ProductSideBar } from "../../side-bar";
import { AddressInput } from "../common/address-input";
import { PhoneInput } from "../common/phone-input";
import { ProfileImageUploader } from "../common/profile-image-uploader";
import { TextInput } from "../common/text-input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface StylistUserFormProps {
  data: IUser;
  userId: string;
}

export default function StylistUserForm({
  data,
  userId,
}: StylistUserFormProps) {
  const userData = data;
  const router = useRouter();
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: session, status } = useSession();
  const [toast, setToast] = useRecoilState(toastState);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session?.user?.id !== userId && session?.user?.userType !== "admin")
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  // 프로필 업데이트
  useEffect(() => {
    const fetchUserProfileImage = async () => {
      if (status === "authenticated" && session?.user?.id) {
        const userData = await getUserById(session.user.id);
        if (userData?.profileImage) {
          session.user.image = userData.profileImage;
        }
      }
    };

    fetchUserProfileImage();
  }, [status, session]);

  useEffect(() => {
    if (data) {
      const convertBase64ToFile = async () => {
        const user = base64ToFile(
          userData.profileImage,
          userData.profileFileName!
        );
        setProfileImg(user);
      };

      convertBase64ToFile();
    }
  }, [data]);

  const handleProfileImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProfileImg(files[0]);
  };

  const handleProfileImageClick = (event: MouseEvent<HTMLLabelElement>) => {
    event.stopPropagation();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (profileImg) {
      formData.delete("profileImage");
      formData.append("profileImage", profileImg);
    }

    console.log("Homepage value:", formData.get("homepage"));
    const result: IResponse = await editProfile(userId, formData);

    if (!result.success && result.errors) {
      const newErrors: Record<string, string> = {};
      result.errors.forEach((error: any) => {
        if (Array.isArray(error.path) && error.path.length > 0) {
          newErrors[error.path[0]] = error.message;
        }
      });
      setErrors(newErrors);
      setToast({
        isVisible: true,
        message: "프로필 수정 실패: 오류가 발생했습니다.",
        type: "error",
      });
    } else {
      setToast({
        isVisible: true,
        message: "프로필 정보 수정 성공",
        type: "success",
      });
      router.refresh();
    }
  };

  return (
    <>
      <main className="flex flex-col lg:flex-row text-gray-900 label-1">
        <div className="">
          <ProductSideBar />
        </div>

        <div className="w-full mt-8">
          <div className="w-full h-52 bg-primary pl-4 md:pl-36">
            <div className="display text-gray-100 pt-36">프로필 수정</div>
          </div>
          <form
            className="flex flex-col gap-12 p-4 pt-20 md:pl-36 w-full max-w-screen-2xl"
            onSubmit={handleSubmit}
          >
            <ProfileImageUploader
              profileImg={profileImg}
              onProfileImageUpload={handleProfileImageUpload}
              onProfileImageClick={handleProfileImageClick}
              error={errors.profileImage}
            />
            <TextInput
              label="닉네임*"
              name="nickName"
              type="text"
              defaultValue={userData.nickName!}
              error={errors.nickName}
            />
            <TextInput
              label="소속*"
              name="affiliation"
              type="text"
              defaultValue={userData.affiliation!}
              error={errors.affiliation}
            />

            <PhoneInput
              defaultValues={userData.phoneNumber}
              error={errors.phoneNumber}
            />
            <TextInput
              label="담당자 이름*"
              name="name"
              type="text"
              defaultValue={userData.name}
              error={errors.name}
            />
            <TextInput
              label="홈페이지 주소 또는 인스타"
              name="homepage"
              type="text"
              defaultValue={userData.homepage!}
              error={errors.homepage}
            />
            <AddressInput
              defaultAddress={userData.address}
              error={errors.address}
            />
            <TextInput
              label="이메일*"
              name="email"
              type="email"
              defaultValue={userData.email}
              error={errors.email}
            />
            <div className="flex justify-center mt-8">
              <div className="flex justify-center items-center border bg-primary text-gray-100 rounded-full w-96 h-14">
                <Button text="프로필 수정" />
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
