"use client";

import { ChangeEvent, DragEvent, MouseEvent, useEffect, useState } from "react";
import Input from "../global/input";
import { ProductLabel } from "./label";
import {
	PRODUCT_CATEGORIES,
	PRODUCT_HEIGHT,
	PRODUCT_SIZE,
	PRODUCT_STYLES,
	PRODUCT_TYPES,
} from "@/constants/variables";
import {
	deleteProduct,
	updateProduct,
} from "@/app/(my-page)/my-page/product/[id]/actions";
import { IProduct } from "@/model/product";
import { useRouter } from "next/navigation";
import useAuth from "@/libs/auth";
import { IResponse } from "@/model/responses";

export const base64ToFile = (
	base64Data: string,
	fileName: string,
	contentType: string = "image/jpeg"
) => {
	const byteString = atob(base64Data.split(",")[1]);
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	const blob = new Blob([ab], { type: contentType });
	return new File([blob], fileName, { type: contentType });
};

export default function ProductForm(data: any) {
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [selectedGender, setSelectedGender] = useState<string | null>(null);
	const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
	const [selectedHeight, setSelectedHeight] = useState<string | null>(null);
	const [images, setImages] = useState<File[]>([]);
	const [imageURLs, setImageURLs] = useState<string[]>([]);
	const [initialData, setInitialData] = useState<IProduct | null>(null);
	const [otherData, setFormData] = useState(new FormData());

	const userAuth = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (data) {
			setInitialData(data.data);
			setSelectedType(data.data.productCategory);
			setSelectedSize(data.data.size);
			setSelectedGender(data.data.genderCategory);
			setSelectedStyles(data.data.styleCategory);
			setSelectedHeight(data.data.height);
			setImageURLs(data.data.productImages || []);
		}
	}, [data]);

	useEffect(() => {
		const newFormData = new FormData();
		if (images.length !== 0)
			images.forEach((image) => newFormData.append("images", image));
		if (images.length === 0)
			imageURLs.forEach((image) => newFormData.append("images", image));
		if (selectedType) newFormData.append("selectedType", selectedType);
		if (selectedSize) newFormData.append("selectedSize", selectedSize);
		if (selectedGender) newFormData.append("selectedGender", selectedGender);
		if (selectedHeight) newFormData.append("selectedHeight", selectedHeight);
		if (selectedStyles) {
			selectedStyles.forEach((style) =>
				newFormData.append("selectedStyles", style)
			);
		}
		if (data) newFormData.append("productId", data.data.id);
		setFormData(newFormData);
	}, [
		selectedType,
		selectedSize,
		selectedGender,
		selectedStyles,
		selectedHeight,
		images,
	]);

	useEffect(() => {
		const convertBase64ToFile = async () => {
			if (imageURLs.length > 0) {
				const files = imageURLs.map((url, index) =>
					base64ToFile(url, `image${Date.now()}.jpeg`)
				);
				setImages(files);
			}
		};
		convertBase64ToFile();
	}, [imageURLs]);

	const selectType = (item: string) => setSelectedType(item);
	const selectSize = (item: string) => setSelectedSize(item);
	const selectGender = (item: string) => setSelectedGender(item);
	const toggleStyle = (item: string) =>
		setSelectedStyles((prev) =>
			prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
		);
	const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setImages((prevImages) => [
			...prevImages,
			...files.slice(0, 5 - prevImages.length),
		]);

		setImageURLs([]);
	};

	const handleDragStart = (event: DragEvent<HTMLDivElement>, index: number) => {
		event.dataTransfer.setData("index", index.toString());
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
		const draggedIndex = parseInt(event.dataTransfer.getData("index"), 10);
		const reorderedImages = [...images];
		const [draggedImage] = reorderedImages.splice(draggedIndex, 1);
		reorderedImages.splice(index, 0, draggedImage);
		setImages(reorderedImages);
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleRemoveImage = (
		event: MouseEvent<HTMLButtonElement>,
		index: number
	) => {
		event.stopPropagation();
		setImages((prevImages) => prevImages.filter((_, i) => i !== index));
		setImageURLs((prevURLs) => prevURLs.filter((_, i) => i !== index));
	};

	const handleLabelClick = (event: MouseEvent<HTMLLabelElement>) => {
		event.stopPropagation();
	};

	const handleSubmitUpdate = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		const productId = formData.get("productId") as string;
		const result = await updateProduct(otherData, formData);

		if (result.success) {
			alert(result.message);
			router.push("/my-page/product-list");
		} else {
			alert(result.message);
		}
	};

	const handleSubmitDelete = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		const productId = data.data.id;
		const result: IResponse = await deleteProduct(productId);

		if (result.success) {
			alert(result.message);
			router.push("/my-page/product-list");
		} else {
			alert(result.message);
		}
	};

	if (!initialData) return <div>Loading...</div>;

	return (
		<>
			<div className="h-fit flex flex-col justify-start items-start px-4 lg:px-36 pt-60 max-w-screen-2xl">
				<div className="display">상품 정보 수정</div>
				<form
					className="w-full flex flex-col mt-16 max-w-screen-xl"
					onSubmit={handleSubmitUpdate}
				>
					<div className="w-full">
						<div className="label-1 flex flex-col justify-between w-full mb-4 lg:flex-row">
							<span>상품 이미지(최대 5장)*</span>
							<span className="text-gray-400 md:mt-0">
								제일 첫 번째 이미지가 상품의 대표 이미지가 됩니다. 이미지를
								끌어당겨 순서를 바꿀 수 있습니다.
							</span>
						</div>
						<input
							type="file"
							accept="image/*"
							multiple
							onChange={handleImageUpload}
							className="hidden"
							id="image-upload"
						/>
						<label
							htmlFor="image-upload"
							className="cursor-pointer"
							onClick={handleLabelClick}
						>
							<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-[1rem] w-full gap-3">
								{Array.from({ length: 5 }).map((_, index) => (
									<div
										key={index}
										className="relative h-[20rem] bg-gray-100 flex justify-center items-center"
										draggable={!!images[index] || !!imageURLs[index]}
										onDragStart={(event) => handleDragStart(event, index)}
										onDrop={(event) => handleDrop(event, index)}
										onDragOver={handleDragOver}
									>
										{images[index] && (
											<>
												<img
													src={URL.createObjectURL(images[index])}
													alt={`uploaded-${index}`}
													className="object-cover h-[311px] w-full"
													style={{ objectFit: "cover" }}
												/>
												<button
													type="button"
													onClick={(event) => handleRemoveImage(event, index)}
													className="absolute top-0 right-0 m-2 p-1 size-8 bg-white rounded-full text-gray-500 hover:text-gray-700"
												>
													X
												</button>
											</>
										)}
									</div>
								))}
							</div>
						</label>
					</div>
					<div className="w-full md:w-[36rem] mt-12 label-1 flex flex-col gap-3">
						<div>상품 이름 *</div>
						<Input
							name="productName"
							count={40}
							defaultValue={initialData.title}
						/>
					</div>
					<div className="w-full flex flex-col gap-[0.75rem] label-1 mt-[3.75rem]">
						<div className="font-bold">상품 종류 (1개 선택) *</div>
						<ProductLabel
							list={PRODUCT_CATEGORIES}
							selectedItems={selectedType ? [selectedType] : []}
							onSelect={selectType}
						/>
					</div>
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="font-bold flex-col md:flex-row gap-[0.75rem] mt-[3.75rem]">
							<span>상품 사이즈 *</span>
							<span className="text-gray-400 md:mt-0">사이즈 가이드 </span>
						</div>
						<ProductLabel
							list={PRODUCT_SIZE} // size 추가 필요
							selectedItems={selectedSize ? [selectedSize] : []}
							onSelect={selectSize}
						/>
					</div>
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="w-full md:w-[36rem] mt-[3rem] label-1 flex flex-col gap-[12px]">
							<div>맞춤 키 *</div>
							<select
								// 수정 필요
								defaultValue={selectedHeight || ""}
								name="height"
								className="text-gray-800 py-5 px-4 rounded-md focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none"
							>
								<option>사이즈를 선택하세요.</option>
								{Object.entries(PRODUCT_HEIGHT).map(([key, value]) => (
									<option key={value}>{value}</option>
								))}
							</select>
						</div>
					</div>
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="font-bold flex gap-[0.75rem] mt-[3.75rem]">
							분류(1개 선택) *
						</div>
						<ProductLabel
							list={PRODUCT_TYPES}
							selectedItems={selectedGender ? [selectedGender] : []}
							onSelect={selectGender}
						/>
					</div>
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="font-bold flex gap-[0.75rem] mt-[3.75rem]">
							스타일(최소 1개, 중복 가능) *
						</div>
						<ProductLabel
							list={PRODUCT_STYLES}
							selectedItems={selectedStyles ? selectedStyles : []}
							onSelect={toggleStyle}
						/>
					</div>
					<div className="mt-[5rem] w-full h-fit flex justify-center label-1 text-gray-100">
						<button type="submit" className="bg-primary px-12 py-4 rounded-3xl">
							상품 수정하기
						</button>
					</div>
				</form>
				<form
					className="w-full flex flex-col mt-4"
					onSubmit={handleSubmitDelete}
				>
					<div className="w-full h-fit flex justify-center label-1 text-gray-100">
						<button type="submit" className="bg-primary px-12 py-4 rounded-3xl">
							상품 삭제하기
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
