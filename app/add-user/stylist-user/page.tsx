"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { PhotoIcon } from "@heroicons/react/24/solid";
import uploadstylistUser from "./actions";
import Input from "@/components/global/input";
import AddressForm from "@/components/address";
import { auth } from "@/config/firebase/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/global/header";
import { IUser } from "@/model/user";

export default function StylistUser() {
  const router = useRouter();
  const [profilephoto, setProfilephoto] = useState("");
  const [isValidSize, setIsValidSize] = useState(true);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setProfilephoto(url);
    setIsValidSize(file.size <= 4 * 1024 * 1024);
  };

  const uid = auth.currentUser?.uid;
  useEffect(() => {
    if (!uid) {
      router.push("/login");
    }
  }, [uid, router]);

  const bindData = uploadstylistUser.bind(null, uid!);
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

        <form action={dispatch} className="flex flex-col mt-16 w-[70%] gap-5">
          <div className="lex justify-between mr-[350px] items-center">
            <p>프로필 사진 *</p>
            <label
              htmlFor="photo"
              className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-full  cursor-pointer bg-center bg-cover w-[200px] h-[160px]"
              style={{ backgroundImage: `url(${profilephoto})` }}
            >
              {profilephoto === "" ? (
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

          <div className="flex justify-between items-center">
            <p>이름 *</p>
            <Input name="name" type="text" placeholder="이름" required />
          </div>
          <div className="flex justify-between items-center">
            <p>닉네임 *</p>
            <Input name="nickname" type="text" placeholder="닉네임" required />
          </div>
          <div className="flex justify-between items-center">
            <p>연락처 *</p>
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
          <div className="flex justify-between">
            <p>주소 *</p> <AddressForm />
          </div>
          <div className="flex justify-between items-center">
            <p>소속 *</p>
            <Input
              name="affiliation"
              type="text"
              placeholder="ex) 프리랜서, 회사, 방송국 소속 등"
            />
          </div>
          <div className="flex justify-between items-center">
            <p>이메일 *</p>
            <Input name="email" type="email" placeholder="example@gmail.com" />
          </div>
          <div className="flex justify-center mt-10">
            <button
              className="border bg-primary text-gray-100 rounded-[40px] w-[200px] h-[50px]"
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
