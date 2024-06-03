"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Input from "@/components/global/input";
import AddressForm from "@/components/global/address";
import uploadbrandUser from "./actions";
import { auth } from "@/config/firebase/firebase";
import Header from "@/components/global/header";
import { useRouter } from "next/navigation";

export default function BrandUser() {
  const router = useRouter();
  const [profilephoto, setProfilephoto] = useState<string | null>(null);
  const [certificatephoto, setCertificatephoto] = useState<string | null>(null);
  const [isValidSize, setIsValidSize] = useState<boolean>(true);

  const onProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setProfilephoto(url);
    setIsValidSize(file.size <= 4 * 1024 * 1024);
  };

  const onCertificateImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const [uploadResponse, dispatch] = useFormState(bindData, null);
  useEffect(() => {
    if (uploadResponse && uploadResponse.success) {
      router.push("/");
    }
  }, [uploadResponse, router]);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center max-w-screen-2xl pt-60 ml-24">
        <div className="w-full">
          <div className="caption w-[4rem] f-[1.5rem] bg-gray-700 border rounded-[3.5rem] text-center text-gray-100 mb-5  mt-[7.5rem]">
            step 2
          </div>
          <div className="display text-gray-900  w-[15.5rem] h-[3.2rem]">
            프로필에 필요한 정보를 입력해 주세요
          </div>
        </div>

        <form action={dispatch} className="flex flex-col mt-16 w-full gap-5">
          <div className="flex lg:items-center w-full flex-col lg:justify-between lg:flex-row">
            <p className="w-[30%] label-1 text-gray-900">프로필 사진 *</p>
            <div className="w-full">
              <label
                htmlFor="profile_photo"
                className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-full  cursor-pointer bg-center bg-cover w-52 h-52 shrink-0"
                style={{
                  backgroundImage: profilephoto
                    ? `url(${profilephoto})`
                    : "none",
                }}
              >
                {profilephoto === null && (
                  <>
                    <PhotoIcon className="w-16" />
                    <div className="text-neutral-400 text-sm">
                      사진을 추가해주세요.
                    </div>
                  </>
                )}
                <Input
                  id="profile_photo"
                  name="profile_photo"
                  type="file"
                  required
                  accept="image/*"
                  className="hidden"
                  onChange={onProfileImageChange}
                />
              </label>
            </div>
            {!isValidSize && (
              <div className="text-red-500 text-center mt-2">
                이미지 크기는 4MB 이하여야 합니다.
              </div>
            )}
          </div>

          <div className="flex lg:items-center w-full flex-col lg:justify-between lg:flex-row ">
            <span className="w-[30%] label-1 text-gray-900">브랜드명 *</span>
            <Input
              name="brand_name"
              type="text"
              placeholder="브랜드명"
              required
            />
          </div>

          <div className="flex lg:items-center w-full flex-col lg:justify-between lg:flex-row ">
            <span className="w-[30%] label-1 text-gray-900">대표 연락처 *</span>
            <div className="flex w-full gap-4 items-center">
              <Input
                name="phoneNumber1"
                type="tel"
                placeholder="000"
                required
                maxLength={3}
              />
              <div>-</div>
              <Input
                name="phoneNumber2"
                type="tel"
                placeholder="0000"
                required
                maxLength={4}
              />
              <div>-</div>
              <Input
                name="phoneNumber3"
                type="tel"
                placeholder="0000"
                required
                maxLength={4}
              />
            </div>
          </div>

          <div className="flex lg:items-center w-full flex-col lg:justify-between lg:flex-row ">
            <span className="w-[30%] label-1 text-gray-900">담당자 이름 *</span>
            <Input name="name" type="text" placeholder="담당자 이름" required />
          </div>

          <div className="flex lg:items-center w-full flex-col lg:justify-between lg:flex-row ">
            <span className="w-[30%] label-1 text-gray-900">
              브랜드 홈페이지 *
            </span>
            <Input
              name="homepage"
              type="text"
              placeholder="https://www.yourbrand.com"
              required
            />
          </div>

          <div className="flex lg:items-center w-full flex-col lg:justify-between lg:flex-row ">
            <span className="w-[30%] label-1 text-gray-900">주소 *</span>
            <span className="h-fit flex  w-full">
              <AddressForm />
            </span>
          </div>

          <div className="flex lg:items-center w-full flex-col lg:justify-between lg:flex-row ">
            <span className="w-[30%] label-1 text-gray-900">이메일 *</span>
            <Input name="email" type="email" placeholder="example@gmail.com" />
          </div>

          <div className="flex lg:items-center w-full flex-col lg:justify-between lg:flex-row ">
            <span className="w-[30%] label-1 text-gray-900">
              사업자 등록증 사진 첨부 *
            </span>

            <div className="w-full">
              <label
                htmlFor="business_photo"
                className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-s-md  cursor-pointer bg-center bg-cover w-[50Rem] h-[20rem] shrink-0"
                style={{
                  backgroundImage: certificatephoto
                    ? `url(${certificatephoto})`
                    : "none",
                }}
              >
                {certificatephoto === null && (
                  <>
                    <PhotoIcon className="w-16" />
                    <div className="text-neutral-400 text-sm">
                      사진을 추가해주세요.
                    </div>
                  </>
                )}
                <Input
                  id="business_photo"
                  name="business_photo"
                  type="file"
                  required
                  accept="image/*"
                  className="hidden"
                  onChange={onCertificateImageChange}
                />
              </label>
            </div>
            {!isValidSize && (
              <div className="text-red-500 text-center mt-2">
                이미지 크기는 4MB 이하여야 합니다.
              </div>
            )}
          </div>

          <div className="flex justify-center mt-10">
            <button
              className="border bg-primary rounded-[3.5rem] w-96 h-14 flex justify-center items-center"
              type="submit"
            >
              <span className="label-1 text-gray-100">신청하기</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
