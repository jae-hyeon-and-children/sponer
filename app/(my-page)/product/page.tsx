"use client";

import Input from "@/app/components/global/Input";

// export async function handleSubmit(formData: FormData) {
// 	'use server'

// }

export const createProduct = () => {
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
			<div className="w-full h-[84px] bg-gray-300 flex justify-center items-center display ">
				임시 Header
			</div>
			<div className=" h-screen flex flex-col justify-start items-start px-[9.5rem] mt-12">
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
						<div className="flex gap-[0.75rem]">
							{productType.map((type) => (
								// 이 부분 컴포넌트 만들기
								<div
									className="text-gray-400 border border-gray-200 py-2 px-4 rounded-3xl"
									key={type}
								>
									{type}
								</div>
							))}
						</div>
					</div>
					{/* 상품 사이즈 */}
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="font-bold flex gap-[0.75rem] mt-[3.75rem]">
							<span>상품 사이즈 *</span>
							<span className="text-gray-400">사이즈 가이드 </span>
						</div>
						<div className="flex gap-[0.75rem]">
							{size.map((s) => (
								// 이 부분 컴포넌트 만들기
								<div
									className="text-gray-400 border border-gray-200 py-2 px-4 rounded-3xl"
									key={s}
								>
									{s}
								</div>
							))}
						</div>
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
						<div className="flex gap-[0.75rem]">
							{gender.map((s) => (
								// 이 부분 컴포넌트 만들기
								<div
									className="text-gray-400 border border-gray-200 py-2 px-4 rounded-3xl"
									key={s}
								>
									{s}
								</div>
							))}
						</div>
					</div>
					{/* 스타일 */}
					<div className="w-full flex flex-col gap-[0.75rem] label-1">
						<div className="font-bold flex gap-[0.75rem] mt-[3.75rem]">
							스타일(최소 1개, 중복 가능) *
						</div>
						<div className="flex gap-[0.75rem] mb-12">
							{style.map((s) => (
								// 이 부분 컴포넌트 만들기
								<div
									className="text-gray-400 border border-gray-200 py-2 px-4 rounded-3xl"
									key={s}
								>
									{s}
								</div>
							))}
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default createProduct;
