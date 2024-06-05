"use client";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { base64ToFile } from "./product-form";
import { IUser } from "../../model/user";
import Input from "../global/input";
import { editProfile } from "@/app/(my-page)/my-page/[id]/actions";
import { ProductSideBar } from "./side-bar";
import Button from "../global/button";
import AddressForm from "../global/address";
import { IResponse } from "@/model/responses";

interface StylistUserFormProps {
	data: IUser;
	userId: string;
}

export default function StylistUserForm({
	data,
	userId,
}: StylistUserFormProps) {
	const userData = data;
	const [profileImg, setProfileImg] = useState<File | null>(null);
	const [phoneNum1, setPhoneNum1] = useState<string | null>(null);
	const [phoneNum2, setPhoneNum2] = useState<string | null>(null);
	const [phoneNum3, setPhoneNum3] = useState<string | null>(null);

	useEffect(() => {
		const convertBase64ToFile = async () => {
			const user = base64ToFile(
				userData.profileImage,
				`user${Date.now()}.jpeg`
			);
			setProfileImg(user);
		};

		const phoneNum = userData.phoneNumber.split("-");
		setPhoneNum1(phoneNum[0]);
		setPhoneNum2(phoneNum[1]);
		setPhoneNum3(phoneNum[2]);

		convertBase64ToFile();
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
		} else {
			const formData = new FormData(event.currentTarget);
			formData.delete("profileImage");
			formData.append("profileImage", profileImg);

			const result: IResponse = await editProfile(userId, formData);
		}
	};

	const updateWithUserID = editProfile.bind(null, userId);

	return (
		<main className="flex flex-col lg:flex-row h-screen text-gray-900 label-1">
			<ProductSideBar />
			<div className="w-full mt-20">
				<div className="w-full h-52 bg-primary pl-4 md:pl-36">
					<div className="display text-gray-100 pt-36">프로필 수정</div>
				</div>
				<form
					className="flex flex-col gap-12 p-4 pt-20 md:pl-36 w-full max-w-screen-2xl"
					// action={updateWithUserID}
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col md:flex-row justify-between w-full">
						<span>프로필 사진*</span>
						<span className="w-full md:w-[36rem] flex justify-start mt-4 md:mt-0">
							<input
								type="file"
								name="profileImage"
								accept="image/*"
								className="hidden size-52"
								onChange={handleProfileImageUpload}
								id="profile-upload"
							></input>
							<label
								htmlFor="profile-upload"
								className="cursor-pointer h-fit w-fit"
								onClick={handleProfileImageClick}
							>
								{profileImg && (
									<img
										src={URL.createObjectURL(profileImg)}
										alt={`uploaded-${userData.name}`}
										className="object-cover rounded-full w-52 h-52"
										style={{ objectFit: "cover" }}
									/>
								)}
							</label>
						</span>
					</div>
					<div className="flex flex-col md:flex-row justify-between w-full">
						<span>닉네임*</span>
						<span className="w-full md:w-[36rem] mt-4 md:mt-0">
							<Input
								name="nickName"
								type="text"
								defaultValue={userData.nickName}
							></Input>
						</span>
					</div>
					<div className="flex flex-col md:flex-row justify-between w-full">
						<span>소속*</span>
						<span className="w-full md:w-[36rem] mt-4 md:mt-0">
							<Input
								name="affiliation"
								type="text"
								defaultValue={userData.affiliation}
							></Input>
						</span>
					</div>
					<div className="flex flex-col md:flex-row justify-between w-full">
						<span>대표 연락처*</span>
						<span className="flex flex-col md:flex-row gap-4 w-full md:w-[36rem] mt-4 md:mt-0">
							<Input
								name="phoneNumber1"
								type="text"
								defaultValue={userData.phoneNumber.slice(0, 3)}
							></Input>
							<Input
								name="phoneNumber2"
								type="text"
								defaultValue={userData.phoneNumber.slice(3, 7)}
							></Input>
							<Input
								name="phoneNumber3"
								type="text"
								defaultValue={userData.phoneNumber.slice(7, 11)}
							></Input>
						</span>
					</div>
					<div className="flex flex-col md:flex-row justify-between w-full">
						<span>담당자 이름*</span>
						<span className="w-full md:w-[36rem] mt-4 md:mt-0">
							<Input
								name="name"
								type="text"
								defaultValue={userData.name}
							></Input>
						</span>
					</div>
					<div className="flex flex-col md:flex-row justify-between w-full">
						<span>브랜드 홈페이지 주소 또는 인스타</span>
						<span className="w-full md:w-[36rem] mt-4 md:mt-0">
							<Input
								name="homepage"
								type="text"
								defaultValue={userData.homepage}
							></Input>
						</span>
					</div>
					<div className="flex flex-col md:flex-row justify-between w-full">
						<span>주소*</span>
						<span className="w-[36rem]">
							<AddressForm />
						</span>
					</div>
					<div className="flex flex-col md:flex-row justify-between w-full">
						<span>이메일*</span>
						<span className="w-full md:w-[36rem] mt-4 md:mt-0">
							<Input
								name="email"
								type="email"
								defaultValue={userData.email}
							></Input>
						</span>
					</div>
					<div className="flex justify-center mt-8">
						<div className="flex justify-center items-center border bg-primary text-gray-100 rounded-full w-96 h-14">
							<Button text="프로필 수정"></Button>
						</div>
					</div>
				</form>
			</div>
		</main>
	);
}
