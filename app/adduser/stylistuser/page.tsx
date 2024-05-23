"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { PhotoIcon } from "@heroicons/react/24/solid";

import uploadstylistUser from "./action";
import NavBar from "@/components/header";
import Input from "@/components/global/input";
import AddressForm from "@/components/address";

export default function StylistUser() {
  const [sibal, dispatch] = useFormState(uploadstylistUser, null);
  const [preview, setPreview] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isValidSize, setIsValidSize] = useState(true);
  const [formState, setFormState] = useState(null);
  const router = useRouter();

  const onImageChange = (event: any) => {
    console.log("1111111d:", event.target.files[0]);
    const { files } = event.target;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setIsImageUploaded(true);
    setIsValidSize(file.size <= 4 * 1024 * 1024); // 4MB 이하인지 확인
  };

  // const onSubmit = async (event: any) => {
  //   event.preventDefault();
  //   if (isImageUploaded && isValidSize) {
  //     const formData = new FormData(event.currentTarget);
  //     const imageFileInput = document.getElementById(
  //       "photo"
  //     ) as HTMLInputElement;
  //     if (imageFileInput && imageFileInput.files && imageFileInput.files[0]) {
  //       formData.append("photo", imageFileInput.files[0]);
  //       console.log("P222222orm data:", imageFileInput.files[0]);
  //     }

  //     // 모든 폼 데이터 확인
  //     formData.forEach((value, key) => {
  //       console.log("key, value is : ", key, value);
  //     });

  //     const result = await uploadstylistUser(formState, formData);
  //     if (result.success) {
  //       alert(result.message);
  //       router.push("/");
  //     } else {
  //       alert(result.message);
  //     }
  //   } else {
  //     alert("이미지를 업로드하거나 이미지 크기를 확인하세요.");
  //   }
  // };

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

        <form
          action={dispatch}
          className="flex flex-col mt-16 w-[70%] gap-5"
          // onSubmit={onSubmit}
        >
          <div className="flex justify-between mr-[350px]">
            <p>프로필 사진 *</p>
            <label
              htmlFor="photo"
              className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-full border-dashed cursor-pointer bg-center bg-cover w-[200px] h-[160px]"
              style={{ backgroundImage: `url(${preview})` }}
            >
              {preview === "" ? (
                <>
                  <PhotoIcon className="w-16" />
                  <div className="text-neutral-400 text-sm">
                    사진을 추가해주세요.
                  </div>
                </>
              ) : null}
              <Input
                id="photo"
                name="photo"
                type="file"
                required
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
              />
            </label>
            {!isValidSize && (
              <div className="text-red-500 text-center mt-2">
                이미지 크기는 4MB 이하여야 합니다.
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <p>이름 *</p>
            <Input name="name" type="text" placeholder="이름" required />
          </div>
          <div className="flex justify-between">
            <p>닉네임 *</p>
            <Input name="nickname" type="text" placeholder="닉네임" required />
          </div>
          <div className="flex justify-between">
            <p>연락처 *</p>
            <Input
              name="phone_number"
              type="tel"
              placeholder="000-0000-0000"
              required
            />
          </div>
          <div className="flex justify-between">
            <p>주소 *</p> <AddressForm />
          </div>
          <div className="flex justify-between">
            <p>소속 *</p>
            <Input
              name="affiliation"
              type="text"
              placeholder="ex) 프리랜서, 회사, 방송국 소속 등"
            />
          </div>
          <div className="flex justify-between">
            <p>이메일 *</p>
            <Input name="email" type="email" placeholder="example@gmail.com" />
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
