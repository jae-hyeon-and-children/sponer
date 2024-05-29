"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Input from "@/components/global/input";
import AddressForm from "@/components/address";
import uploadbrandUser from "./actions";
import { auth } from "@/config/firebase/firebase";
import Header from "@/components/global/header";
import { useRouter } from "next/navigation";
import { IUser } from "@/model/\buser";

export default function BrandUser() {
  const router = useRouter();
  const [profilephoto, setProfilephoto] = useState("");
  const [certificatephoto, setCertificatephoto] = useState("");
  const [isValidSize, setIsValidSize] = useState(true);

  const onProfileImageChange = (event: any) => {
    const { files } = event.target;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setProfilephoto(url);
    setIsValidSize(file.size <= 4 * 1024 * 1024);
  };

  const onCertificateImageChange = (event: any) => {
    const { files } = event.target;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setCertificatephoto(url);
    setIsValidSize(file.size <= 4 * 1024 * 1024);
  };

  const uid = auth.currentUser?.uid;
  useEffect(() => {
    if (!uid) {
      router.push("/login");
    }
  }, [uid, router]);

  const bindData = uploadbrandUser.bind(null, uid!);
  const prevState = { success: undefined, message: "" };
  const [uploadResponse, dispatch] = useFormState<IUser>(bindData, prevState);
  useEffect(() => {
    if (uploadResponse.success) {
      router.push("/");
    }
  }, [uploadResponse, router]);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center max-w-screen-2xl pt-60 ml-24">
        <div>
          <div className="w-[65px] f-[25px] bg-gray-700 border rounded-lg text-center text-gray-100 mb-5 mt-[120px] mr-[700px]">
            step 2
          </div>
          <div className="font-medium text-[30px] w-[250px] h-[50px]">
            프로필에 필요한 정보를 입력해 주세요
          </div>
        </div>

        <form action={dispatch} className="flex flex-col mt-16 w-full gap-5">
          <div className="flex justify-around mr-[350px]">
            <p>프로필 사진 *</p>
            <label
              htmlFor="profile_photo"
              className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-full border-dashed cursor-pointer  bg-center bg-cover w-[200px] h-[160px]"
              style={{
                backgroundImage: `url(${profilephoto})`,
              }}
            >
              {profilephoto === "" ? (
                <>
                  <PhotoIcon className="w-14" />
                  <div className="text-neutral-400 text-sm">
                    사진을 추가해주세요.
                  </div>
                </>
              ) : null}
              <Input
                id="profile_photo"
                name="profile_photo"
                type="file"
                required
                multiple
                accept="image/*"
                className="hidden"
                onChange={onProfileImageChange}
              />
            </label>
            {!isValidSize && (
              <div className="text-red-500 text-center mt-2">
                이미지 크기는 4MB 이하여야 합니다.
              </div>
            )}
          </div>

          <div className="flex justify-around">
            <p>브랜드명 *</p>
            <Input
              name="brand_name"
              type="text"
              placeholder="브랜드명"
              required
            />
          </div>

          <div className="flex justify-around">
            <p>대표 연락처 *</p>
            <Input
              name="phone_number"
              type="tel"
              placeholder="000-0000-0000"
              required
            />
          </div>
          <div className="flex justify-around">
            <p>담당자 이름 *</p>
            <Input name="name" type="text" placeholder="담당자 이름" required />
          </div>
          <div className="flex justify-around">
            <p>브랜드 홈페이지 *</p>
            <Input
              name="homepage"
              type="text"
              placeholder="https://www.yourbrand.com"
              required
            />
          </div>

          <div className="flex justify-around">
            <p>주소 *</p> <AddressForm />
          </div>

          <div className="flex justify-around">
            <p>이메일 *</p>
            <Input name="email" type="email" placeholder="example@gmail.com" />
          </div>
          <div className="flex justify-around">
            <p>사업자 등록증 사진 첨부 *</p>
            <label
              htmlFor="business_photo"
              className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer  bg-center bg-cover w-[600px] h-[300px]"
              style={{
                backgroundImage: `url(${certificatephoto})`,
              }}
            >
              {certificatephoto === "" ? (
                <>
                  <PhotoIcon className="w-14" />
                  <div className="text-neutral-400 text-sm">
                    사진을 추가해주세요 .
                  </div>
                </>
              ) : null}
              <Input
                id="business_photo"
                name="business_photo"
                type="file"
                placeholder="사업자 등록증 사진 첨부"
                required
                accept="image/*"
                className="hidden"
                onChange={onCertificateImageChange}
              />
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
