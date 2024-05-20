"use client";

import Input from "@/app/components/global/Input";
import { ProductLabel } from "@/app/components/product/Label";
import React, { ChangeEvent, DragEvent, MouseEvent, useState } from "react";
import { uploadProduct } from "./actions";
import {
	PRODUCT_CATEGORIES,
	PRODUCT_SIZE,
	PRODUCT_STYLES,
	PRODUCT_TYPES,
} from "@/constants/variables";

const createProduct = () => {
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [selectedGender, setSelectedGender] = useState<string | null>(null);
	const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
	const [images, setImages] = useState<File[]>([]);

	const selectType = (item: string) => {
		setSelectedType(item);
	};

	const selectSize = (item: string) => {
		setSelectedSize(item);
	};

	const selectGender = (item: string) => {
		setSelectedGender(item);
	};

	const toggleStyle = (item: string) => {
		setSelectedStyles((prev) =>
			prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
		);
	};

	const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setImages((prevImages) => [
			...prevImages,
			...files.slice(0, 5 - prevImages.length),
		]);
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
	};

	const handleLabelClick = (event: MouseEvent<HTMLLabelElement>) => {
		event.stopPropagation();
	};

	const handleUploadProduct = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);

		images.forEach((image) => {
			formData.append("images", image);
		});

		if (selectedType) formData.append("selectedType", selectedType);
		if (selectedSize) formData.append("selectedSize", selectedSize);
		if (selectedGender) formData.append("selectedGender", selectedGender);

		selectedStyles.forEach((style) => {
			formData.append("selectedStyles", style);
		});

		const result = await uploadProduct(formData);

		console.log(result.message);
	};

	return (
		<>
			<div className="w-full h-[84px] bg-gray-300 flex justify-center items-center display fixed top-0 z-20">
				임시 Header
			</div>
			<div className=" h-screen flex flex-col justify-start items-start px-[9.5rem] pt-60">
				<div className="display">상품 정보 등록</div>
				<form
					className="w-full flex flex-col mt-[4rem]"
					onSubmit={handleUploadProduct}
				>
					<div className="w-full">
						<div className="label-1 flex justify-between w-full">
							<span>상품 이미지(최대 5장)*</span>
							<span className="text-gray-400">
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
							<div className="grid grid-cols-5 mt-[1rem] w-full h-[311px] gap-3">
								{Array.from({ length: 5 }).map((_, index) => (
									<div
										key={index}
										className="relative h-full bg-gray-100 flex justify-center items-center"
										draggable={!!images[index]}
										onDragStart={(event) => handleDragStart(event, index)}
										onDrop={(event) => handleDrop(event, index)}
										onDragOver={handleDragOver}
									>
										{images[index] ? (
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
													className="absolute top-0 right-0 m-2 p-1 bg-white rounded-full text-gray-500 hover:text-gray-700"
												>
													X
												</button>
											</>
										) : (
											<span className="text-gray-400">Upload Image</span>
										)}
									</div>
								))}
							</div>
						</label>
					</div>
					<div className="w-[36.625rem] mt-[3rem] label-1 flex flex-col gap-[12px]">
						<div>상품 이름 *</div>
						<Input name="productName" count={10} />
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
						<div className="font-bold flex gap-[0.75rem] mt-[3.75rem]">
							<span>상품 사이즈 *</span>
							<span className="text-gray-400">사이즈 가이드 </span>
						</div>
						<ProductLabel
							list={PRODUCT_SIZE} // size 추가 필요
							selectedItems={selectedSize ? [selectedSize] : []}
							onSelect={selectSize}
						/>
					</div>
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="w-[36.625rem] mt-[3rem] label-1 flex flex-col gap-[12px]">
							<div>맞춤 키 *</div>
							<Input name="height" count={10} />
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
							상품 등록하기
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default createProduct;
