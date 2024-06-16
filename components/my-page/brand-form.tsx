"use client";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { base64ToFile } from "./product-form";
import { IUser } from "../../model/user";
import Input from "../global/input";
import { editProfile } from "@/app/(my-page)/my-page/[id]/actions";
import { ProductSideBar } from "./side-bar";
import AddressForm from "../global/address";
import Button from "../global/button";
import { IResponse } from "@/model/responses";
import { useRecoilState } from "recoil";
import { showDefaultModalState } from "@/recoil/atoms";
import Modal from "../global/modal";

interface BrandUserFormProps {
	data: IUser;
	userId: string;
}

export default function BrandUserForm({ data, userId }: BrandUserFormProps) {
	const userData = data;
	const [profileImg, setProfileImg] = useState<File | null>(null);
	const [businessImg, setBusinessImg] = useState<File | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [isShowModal, setShowModal] = useRecoilState(showDefaultModalState);

	const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

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

				console.log(userData.profileFileName);
				console.log(userData.businessFileName);

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
			console.log("hey");
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
			} else {
				setModalContent(<div>브랜드 정보 수정 성공</div>);
				setShowModal(true);
			}
		}
	};

	// const updateWithUserID = editProfile.bind(null, userId);

	return (
		<>
			<Modal>{isShowModal && modalContent}</Modal>

			<main className="flex flex-col lg:flex-row  text-gray-900 label-1">
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
									className="hidden"
									onChange={handleProfileImageUpload}
									id="profile-upload"
									// defaultValue={profileImg}
								></input>
								<label
									htmlFor="profile-upload"
									className="cursor-pointer"
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
								{errors.profileImage && (
									<span className="text-red-500">{errors.profileImage}</span>
								)}
							</span>
						</div>
						<div className="flex flex-col md:flex-row justify-between w-full">
							<span>브랜드명*</span>
							<span className="w-full md:w-[36rem] mt-4 md:mt-0">
								<Input
									name="brandName"
									type="text"
									count={10}
									defaultValue={userData.brandName}
								></Input>
								{errors.brandName && (
									<span className="text-red-500">{errors.brandName}</span>
								)}
							</span>
						</div>
						<div className="flex flex-col md:flex-row justify-between w-full">
							<span>대표 연락처*</span>
							<div className="flex flex-col">
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
								{errors.phoneNumber && (
									<span className="text-red-500">{errors.phoneNumber}</span>
								)}
							</div>
						</div>
						<div className="flex flex-col md:flex-row justify-between w-full">
							<span>담당자 이름*</span>
							<span className="w-full md:w-[36rem] mt-4 md:mt-0">
								<Input
									name="name"
									type="text"
									defaultValue={userData.name}
								></Input>
								{errors.name && (
									<span className="text-red-500">{errors.name}</span>
								)}
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
								{errors.homepage && (
									<span className="text-red-500">{errors.homepage}</span>
								)}
							</span>
						</div>
						<div className="flex flex-col md:flex-row justify-between w-full">
							<span>사업장 주소*</span>
							<span className="w-full md:w-[36rem] mt-4 md:mt-0">
								<AddressForm fullAddress={userData.address} />
								{errors.address && (
									<span className="text-red-500">{errors.address}</span>
								)}
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
								{errors.email && (
									<span className="text-red-500">{errors.email}</span>
								)}
							</span>
						</div>
						<div className="flex flex-col md:flex-row justify-between w-full">
							<span>사업자 등록증*</span>
							<span className="w-full md:w-[36rem] mt-4 md:mt-0">
								<input
									type="file"
									name="businessImageUrl"
									id="business-upload"
									className="hidden"
									onChange={handleBusinessImageUpload}
									// defaultValue={businessImg}
								></input>
								<label
									htmlFor="business-upload"
									className="cursor-pointer"
									onClick={handleBusinessImageClick}
								>
									{businessImg && (
										<img
											src={URL.createObjectURL(businessImg)}
											alt={`uploaded-${userData.name}`}
											className="object-cover w-full md:w-[36.625rem] h-[282px]"
											style={{ objectFit: "cover" }}
										/>
									)}
								</label>
								{errors.businessImageUrl && (
									<span className="text-red-500">
										{errors.businessImageUrl}
									</span>
								)}
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
		</>
	);
}
