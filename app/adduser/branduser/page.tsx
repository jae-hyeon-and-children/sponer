"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/global/input";
import NavBar from "@/app/components/header";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { PhotoIcon } from "@heroicons/react/24/solid";

import AddressForm from "@/app/components/address";
import { useFormState } from "react-dom";
import uploadbrabdUser from "./actions";

export default function BrandUser() {
  const [sibal, dispatch] = useFormState(uploadbrabdUser, null);
  const [profilePreview, setProfilePreview] = useState("");
  const [certificatePreview, setCertificatePreview] = useState("");
  const [isProfileImageUploaded, setIsProfileImageUploaded] = useState(false);
  const [isCertificateImageUploaded, setIsCertificateImageUploaded] =
    useState(false);
  const [isValidSize, setIsValidSize] = useState(true);
  const [formState, setFormState] = useState(null);
  const router = useRouter();

  const onProfileImageChange = (event: any) => {
    const { files } = event.target;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setProfilePreview(url);
    setIsProfileImageUploaded(true);
    setIsValidSize(file.size <= 4 * 1024 * 1024); // 4MB 이하인지 확인
  };

  const onCertificateImageChange = (event: any) => {
    const { files } = event.target;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setCertificatePreview(url);
    setIsCertificateImageUploaded(true);
    setIsValidSize(file.size <= 4 * 1024 * 1024); // 4MB 이하인지 확인
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (isProfileImageUploaded && isCertificateImageUploaded && isValidSize) {
      const formData = new FormData(event.currentTarget);
      const profileImageFileInput = document.getElementById(
        "profile_photo"
      ) as HTMLInputElement;
      const certificateImageFileInput = document.getElementById(
        "certificate_photo"
      ) as HTMLInputElement;

      if (
        profileImageFileInput &&
        profileImageFileInput.files &&
        profileImageFileInput.files[0]
      ) {
        formData.append("profile_photo", profileImageFileInput.files[0]);
      }

      if (
        certificateImageFileInput &&
        certificateImageFileInput.files &&
        certificateImageFileInput.files[0]
      ) {
        formData.append(
          "certificate_photo",
          certificateImageFileInput.files[0]
        );
      }

      // 모든 폼 데이터 확인
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const result = await uploadbrabdUser(formState, formData);
      if (result.success) {
        alert(result.message);
        router.push("/");
      } else {
        alert(result.message);
      }
    } else {
      alert("이미지를 업로드하거나 이미지 크기를 확인하세요.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center max-w-screen-2xl pt-60 ml-24">
        <div>
          <div className="w-[65px] f-[25px] bg-gray-700 border rounded-lg text-center text-gray-100 mb-5 mt-[120px] mr-[700px]">
            step 2
          </div>
          <div className="font-medium text-[30px] w-[250px] h-[50px]">
            프로필에 필요한 정보를 입력해 주세요
          </div>
        </div>

        <form className="flex flex-col mt-16 w-full gap-5" onSubmit={onSubmit}>
          <div className="flex justify-around mr-[350px]">
            프로필 사진 *{" "}
            <label
              htmlFor="profile_photo"
              className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-full border-dashed cursor-pointer  bg-center bg-cover w-[200px] h-[160px]"
              style={{
                backgroundImage: `url(${profilePreview})`,
              }}
            >
              {profilePreview === "" ? (
                <>
                  <PhotoIcon className="w-14" />
                  <div className="text-neutral-400 text-sm">
                    사진을 추가해주세요.{" "}
                    <Input
                      id="profile_photo"
                      name="profile_photo"
                      type="file"
                      required
                      accept="image/*"
                      className="hidden"
                      onChange={onProfileImageChange}
                    />
                  </div>
                </>
              ) : null}
            </label>
            {!isValidSize && (
              <div className="text-red-500 text-center mt-2">
                이미지 크기는 4MB 이하여야 합니다.
              </div>
            )}
          </div>

          <div className="flex justify-around">
            브랜드명 *{" "}
            <Input
              name="brand_name"
              type="text"
              placeholder="브랜드명"
              required
            />
          </div>

          <div className="flex justify-around">
            대표 연락처 *{" "}
            <Input
              name="phone_number"
              type="tel"
              placeholder="000-0000-0000"
              required
            />
          </div>
          <div className="flex justify-around">
            담당자 이름 *{" "}
            <Input name="name" type="text" placeholder="담당자 이름" required />
          </div>
          <div className="flex justify-around">
            브랜드 홈페이지 *{" "}
            <Input
              name="homepage"
              type="text"
              placeholder="https://www.yourbrand.com"
              required
            />
          </div>

          <div className="flex justify-around">
            주소 * <AddressForm />
          </div>

          <div className="flex justify-around">
            이메일{" "}
            <Input name="email" type="email" placeholder="example@gmail.com" />
          </div>
          <div className="flex justify-around">
            사업자 등록증 사진 첨부 *{" "}
            <label
              htmlFor="certificate_photo"
              className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer  bg-center bg-cover w-[600px] h-[300px]"
              style={{
                backgroundImage: `url(${certificatePreview})`,
              }}
            >
              {certificatePreview === "" ? (
                <>
                  <PhotoIcon className="w-14" />
                  <div className="text-neutral-400 text-sm">
                    사진을 추가해주세요 .{" "}
                    <Input
                      id="certificate_photo"
                      name="certificate_photo"
                      type="file"
                      placeholder="사업자 등록증 사진 첨부"
                      required
                      accept="image/*"
                      className="hidden"
                      onChange={onCertificateImageChange}
                    />
                  </div>
                </>
              ) : null}
            </label>
            {!isValidSize && (
              <div className="text-red-500 text-center mt-2">
                이미지 크기는 4MB 이하여야 합니다.
              </div>
            )}
          </div>
          <div className="flex justify-center mt-10">
            <button
              className="border bg-gray-500 text-gray-100 rounded-[40px] w-[200px] h-[50px]"
              type="submit"
            >
              신청하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
