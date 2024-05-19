"use client";

import Input from "@/app/components/global/Input";
import { ProductLabel } from "@/app/components/product/Label";
import { useState } from "react";

// export async function handleSubmit(formData: FormData) {
// 	'use server'

// }

export const createProduct = () => {
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [selectedGender, setSelectedGender] = useState<string | null>(null);
	const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

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

	const productType = [
		"상의",
		"바지",
		"아우터",
		"신발",
		"원피스",
		"스커트",
		"모자",
		"악세서리",
	];

	const size = ["XS", "S", "M", "L", "XL"];

	const gender = ["여자", "남자", "키즈"];

	const style = [
		"스트릿",
		"정장",
		"캐쥬얼",
		"스포츠",
		"빈티지",
		"댄디",
		"페미닌",
		"베이직",
		"모던",
	];

	return (
		<>
			<div className="w-full h-[84px] bg-gray-300 flex justify-center items-center display fixed top-0">
				임시 Header
			</div>
			<div className=" h-screen flex flex-col justify-start items-start px-[9.5rem] pt-60">
				{/* 헤더 */}
				<div className="display">상품 정보 수정</div>
				<form className="w-full flex flex-col mt-[4rem]">
					{/* 상품 이미지 */}
					<div className="w-full">
						<div className="label-1 flex justify-between w-full">
							<span>상품 이미지(최대 5장)*</span>
							<span className="text-gray-400">
								제일 첫 번째 이미지가 상품의 대표 이미지가 됩니다. 이미지를
								끌어당겨 순서를 바꿀 수 있습니다.
							</span>
						</div>
						{/* 이미지 높이 수정 필요 */}
						<div className="grid grid-cols-5 mt-[1rem] w-full h-[311px] gap-3">
							<div className=" h-full bg-gray-100"></div>
							<div className=" h-full bg-gray-100"></div>
							<div className=" h-full bg-gray-100"></div>
							<div className=" h-full bg-gray-100"></div>
							<div className=" h-full bg-gray-100"></div>
						</div>
					</div>
					{/* 상품 이름 */}
					<div className="w-[36.625rem] mt-[3rem] label-1 flex flex-col gap-[12px]">
						<div>상품 이름 *</div>
						<Input name="productName" count={10} />
					</div>
					{/* 상품 종류 */}
					<div className="w-full flex flex-col gap-[0.75rem] label-1 mt-[3.75rem]">
						<div className="font-bold">상품 종류 (1개 선택) *</div>
						<ProductLabel
							list={productType}
							selectedItems={selectedType ? [selectedType] : []}
							onSelect={selectType}
						/>
					</div>
					{/* 상품 사이즈 */}
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="font-bold flex gap-[0.75rem] mt-[3.75rem]">
							<span>상품 사이즈 *</span>
							<span className="text-gray-400">사이즈 가이드 </span>
						</div>
						<ProductLabel
							list={size}
							selectedItems={selectedSize ? [selectedSize] : []}
							onSelect={selectSize}
						/>
					</div>
					{/* 맞춤 키 */}
					{/* 임시로 input / select로 변경 필요 */}
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="w-[36.625rem] mt-[3rem] label-1 flex flex-col gap-[12px]">
							<div>맞춤 키 *</div>
							<Input name="productName" count={10} />
						</div>
					</div>
					{/* 분류 */}
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="font-bold flex gap-[0.75rem] mt-[3.75rem]">
							분류(1개 선택) *
						</div>
						<ProductLabel
							list={gender}
							selectedItems={selectedGender ? [selectedGender] : []}
							onSelect={selectGender}
						/>
					</div>
					{/* 스타일 */}
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="font-bold flex gap-[0.75rem] mt-[3.75rem]">
							스타일(최소 1개, 중복 가능) *
						</div>
						<ProductLabel
							list={style}
							selectedItems={selectedStyles ? selectedStyles : []}
							onSelect={toggleStyle}
						/>
					</div>
					<div className="mt-[5rem] w-full h-fit flex justify-center label-1 text-gray-100">
						<button className="bg-primary px-12 py-4 rounded-3xl">
							상품 등록하기
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default createProduct;
