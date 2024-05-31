"use client";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { base64ToFile } from "./product-form";
import { IUser } from "../../model/user";
import Input from "../global/input";
import { editProfile } from "@/app/(my-page)/my-page/[id]/actions";
import { ProductSideBar } from "./side-bar";
import AddressForm from "../address";
import Button from "../button";

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

	useEffect(() => {
		const convertBase64ToFile = async () => {
			const user = base64ToFile(
				userData.profileImage,
				`user${Date.now()}.jpeg`
			);
			setProfileImg(user);
		};

		convertBase64ToFile();
	}, [data]);

	const handleProfileImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setProfileImg(files[0]);
	};

	const handleProfileImageClick = (event: MouseEvent<HTMLLabelElement>) => {
		event.stopPropagation();
	};

	const updateWithUserID = editProfile.bind(null, userId);

	return (
		<main className="flex h-screen  max-w-screen-2xl text-gray-900 label-1">
			<ProductSideBar />
			<div className="w-full ">
				<div className="w-full h-[10rem] bg-primary mt-[5.25rem] flex justify-center relative">
					<div className="h-fit flex w-5/6 justify-between absolute bottom-8">
						<div className="display text-gray-100">프로필 수정</div>
					</div>
				</div>

				<form
					className="flex flex-col justify-around gap-4 h-screen p-4 w-full"
					action={updateWithUserID}
				>
					<div className="h-fit flex justify-between w-full">
						<span>프로필 사진*</span>
						<span className="w-[36rem] flex justify-start">
							<input
								type="file"
								name="profileImage"
								accept="image/*"
								className="hidden size-[200px]"
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
										className="object-cover size-[200px] rounded-full"
										style={{ objectFit: "cover" }}
									/>
								)}
							</label>
						</span>
					</div>
					<div className="h-fit flex justify-between w-full">
						<span>닉네임*</span>
						<span className="w-[36rem]">
							<Input
								name="nickName"
								type="text"
								defaultValue={userData.nickName}
							></Input>
						</span>
					</div>
					<div className="h-fit flex justify-between w-full">
						<span>소속*</span>
						<span className="w-[36rem]">
							<Input
								name="affiliation"
								type="text"
								defaultValue={userData.affiliation}
							></Input>
						</span>
					</div>
					<div className="h-fit flex justify-between w-full">
						<span>대표 연락처*</span>
						<span className="flex gap-4 w-[36rem]">
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
					<div className="h-fit flex justify-between w-full">
						<span>담당자 이름*</span>
						<span className="w-[36rem]">
							<Input
								name="name"
								type="text"
								defaultValue={userData.name}
							></Input>
						</span>
					</div>
					<div className="h-fit flex justify-between w-full">
						<span>브랜드 홈페이지 주소 또는 인스타</span>
						<span className="w-[36rem]">
							<Input
								name="homepage"
								type="text"
								defaultValue={userData.homepage}
							></Input>
						</span>
					</div>
					<div className="h-fit flex justify-between w-full">
						<span>주소*</span>
						<span className="w-[36rem]">
							<AddressForm />
						</span>
					</div>
					<div className="h-fit flex justify-between w-full">
						<span>이메일*</span>
						<span className="w-[36rem]">
							<Input
								name="email"
								type="email"
								defaultValue={userData.email}
							></Input>
						</span>
					</div>
					<Button text="프로필 수정"></Button>
				</form>
			</div>
		</main>
	);
}
