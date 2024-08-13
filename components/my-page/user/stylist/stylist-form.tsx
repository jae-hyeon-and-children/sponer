"use client";
import { editProfile } from "@/app/(my-page)/my-page/[id]/actions";
import Button from "@/components/global/button";
import { IResponse } from "@/model/responses";
import { IUser } from "@/model/user";
import { showDefaultModalState } from "@/recoil/atoms";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { useRecoilState } from "recoil";
import { base64ToFile } from "../../product/edit-product";
import { ProductSideBar } from "../../side-bar";
import { AddressInput } from "../common/address-input";
import { PhoneInput } from "../common/phone-input";
import { ProfileImageUploader } from "../common/profile-image-uploader";
import { TextInput } from "../common/text-input";
import Modal from "@/components/global/modal";
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

  const [isShowModal, setShowModal] = useRecoilState(showDefaultModalState);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session?.user?.id !== userId && session?.user?.userType !== "admin")
    ) {
      router.push("/");
    }
  }, [status, session, router]);

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

    if (!profileImg) {
      const formData = new FormData(event.currentTarget);
      const result: IResponse = await editProfile(userId, formData);

      if (!result.success && result.errors) {
        const newErrors: Record<string, string> = {};
        result.errors.forEach((error: any) => {
          if (Array.isArray(error.path) && error.path.length > 0) {
            newErrors[error.path[0]] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        setModalContent(<div>스타일리스트 정보 수정 성공</div>);
        setShowModal(true);
      }
    } else {
      const formData = new FormData(event.currentTarget);
      formData.delete("profileImage");
      formData.append("profileImage", profileImg);

      const result: IResponse = await editProfile(userId, formData);

      if (!result.success && result.errors) {
        const newErrors: Record<string, string> = {};
        result.errors.forEach((error: any) => {
          if (Array.isArray(error.path) && error.path.length > 0) {
            newErrors[error.path[0]] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        setModalContent(<div>스타일리스트 정보 수정 성공</div>);
        setShowModal(true);
      }
    }
  };

  return (
    <>
      <Modal>{isShowModal && modalContent}</Modal>
      <main className="flex flex-col lg:flex-row text-gray-900 label-1">
        <ProductSideBar />
        <div className="w-full mt-20">
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
              defaultValues={[
                userData.phoneNumber.slice(0, 3),
                userData.phoneNumber.slice(3, 7),
                userData.phoneNumber.slice(7, 11),
              ]}
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
