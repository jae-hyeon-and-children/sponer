import { ProductSideBar } from "@/app/components/product/sideBar";
import { getProduct } from "./actions";
import Image from "next/image";

export async function productList() {
	const products = await getProduct();

	return (
		<>
			{/* <div className="w-full h-[84px] bg-gray-300 flex justify-center items-center fixed top-0 z-20">
				임시 Header
			</div> */}
			<main className="w-full h-screen flex">
				<ProductSideBar />
				<div className="w-full ml-[15rem]">
					<div className="w-full h-[10rem] bg-primary mt-[5.25rem] flex justify-center relative">
						<div className="h-fit flex w-5/6 justify-between absolute bottom-8">
							<div className="display text-gray-100">상품 관리</div>
							<button className="label-1 text-primary bg-white py-2 px-4 rounded-3xl">
								새로운 상품 등록하기
							</button>
						</div>
					</div>
					<div className="grid grid-cols-4 w-[952px] max-w-screen-2xl gap-6 mt-20 ml-36">
						{products.map((product) => (
							<div className="h-[22.5rem]">
								<Image
									src={product.productImages[0]}
									width={220}
									height={260}
									alt={product.title}
									className="object-cover h-[260px]"
									style={{ objectFit: "cover" }}
								/>
								<div className="pt-5 h-fit w-full flex flex-col">
									<span className="heading-2 text-gray-700 pb-3">
										{product.title}
									</span>
									<span className=" caption-1 text-gray-500 pb-1.5">
										<span>{`${product.size.toUpperCase()} / ${
											product.height
										} / ${product.genderCategory}`}</span>
									</span>
									<span className=" caption-1 text-gray-500 w-full flex gap-2">
										{product.styleCategory.map((style) => (
											<span>{style}</span>
										))}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	);
}

export default productList;

// max-w-screen-2xl
