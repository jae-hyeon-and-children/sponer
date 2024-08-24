"use client";

import { editProfile, getUserById } from "@/app/(my-page)/my-page/[id]/actions";
import Button from "@/components/global/button";
import { IResponse } from "@/model/responses";
import { IBrandApplication, IUser } from "@/model/user";
import { toastState } from "@/recoil/atoms";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { base64ToFile } from "../../product/edit-product";
import { BusinessImageUploader } from "./business-image-uploader";
import { ProfileImageUploader } from "../common/profile-image-uploader";

import { ProductSideBar } from "../../side-bar";
import { TextInput } from "../common/text-input";
import { PhoneInput } from "../common/phone-input";
import { AddressInput } from "../common/address-input";
import { getHistoryById } from "@/app/(my-page)/my-page/history/[id]/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface BrandUserFormProps {
  data: IUser;
  userId: string;
}

export default function BrandUserForm({ data, userId }: BrandUserFormProps) {
  const router = useRouter();
  const userData = data;
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [businessImg, setBusinessImg] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isApprove, setIsApprove] = useState<boolean>(true);
  const [history, setHistory] = useState<string>("");
  const [toast, setToast] = useRecoilState(toastState);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session?.user?.id !== userId && session?.user?.userType !== "admin")
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchApproveData = async () => {
      const historyData: IBrandApplication[] = await getHistoryById(userId);

      if (historyData.length > 0) {
        const latestHistory = historyData[0];

        // 거절된 경우는 무시하고, 승인 대기 중인 경우에만 isApprove를 false로 설정
        if (latestHistory?.approve === false && !latestHistory.reason) {
          setIsApprove(false);
          setHistory(latestHistory.brandName);
        }
      } else {
        // historyData가 비어있을 때 처리할 로직
        console.error("No history records found for this user.");
      }
    };

    fetchApproveData();
  }, [userId]);

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
        const brand = base64ToFile(
          userData.businessImageUrl!,
          userData.businessFileName!
        );

        setProfileImg(user);
        setBusinessImg(brand);
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

  const handleBusinessImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setBusinessImg(files[0]);
  };

  const handleBusinessImageClick = (event: MouseEvent<HTMLLabelElement>) => {
    event.stopPropagation();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profileImg || !businessImg) {
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
      }
    } else {
      const formData = new FormData(event.currentTarget);
      formData.delete("profileImage");
      formData.delete("businessImageUrl");
      formData.append("profileImage", profileImg);
      formData.append("businessImageUrl", businessImg);

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
    }
  };

  return (
    <>
      <main className="flex flex-col lg:flex-row text-gray-900 label-1">
        <ProductSideBar />
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
            <div>
              <TextInput
                label="브랜드명*"
                name="brandName"
                type="text"
                defaultValue={userData.brandName!}
                error={errors.brandName}
              />
              {!isApprove && (
                <p className="text-red-400">{`브랜드 ${history}는 승인 대기 중 입니다.`}</p>
              )}
            </div>

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
              label="브랜드 홈페이지 주소 또는 인스타"
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
            <BusinessImageUploader
              businessImg={businessImg}
              onBusinessImageUpload={handleBusinessImageUpload}
              onBusinessImageClick={handleBusinessImageClick}
              error={errors.businessImageUrl}
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
