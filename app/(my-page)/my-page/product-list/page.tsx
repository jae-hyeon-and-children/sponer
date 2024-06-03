"use client";

import { ProductSideBar } from "@/components/my-page/side-bar";
import { getProduct } from "./actions";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT_STYLES } from "@/constants/variables";
import { IProduct } from "@/model/product";
import useAuth from "@/libs/auth";
import { useEffect, useState } from "react";

export default function ProductList() {
	const [products, setProducts] = useState<IProduct[] | null>(null);

	const userAuth = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			if (userAuth && userAuth.uid) {
				try {
					const result = await getProduct(userAuth.uid);
					setProducts(result);
					console.log(result);
				} catch (error) {
					console.error("Error fetching products:", error);
				}
			}
		};

		fetchData();
	}, [userAuth]);

	if (!products) {
		return <div>Loading products...</div>;
	}

	return (
		<>
			<main className="w-full h-screen flex">
				<ProductSideBar />
				<div className="w-full mt-20">
					<div className="w-full h-52 bg-primary px-4 md:px-36">
						<div className="w-full flex justify-between pt-36 max-w-screen-xl">
							<div className="display text-gray-100">상품 관리</div>
							<Link href={"/my-page/product"}>
								<button className="label-1 text-primary bg-white py-2 px-4 rounded-3xl">
									새로운 상품 등록하기
								</button>
							</Link>
						</div>
					</div>
					<div className="grid grid-cols-3 md:grid-cols-4 w-fit max-w-screen-xl gap-6 px-4 md:pl-36 mt-20 ">
						{products.map((product) => (
							<Link
								href={`/my-page/product/${product.id}`}
								className="h-fit"
								key={product.id}
							>
								<Image
									src={product.productImages[0]}
									width={1000}
									height={260}
									quality={50}
									priority
									alt={product.title}
									className="object-cover h-[260px]"
									style={{ objectFit: "cover" }}
								/>
								<div className="pt-5 h-fit w-full flex flex-col">
									<span className="heading-2 text-gray-700 pb-3">
										{product.title.length > 17
											? product.title.substring(0, 17) + "..."
											: product.title}
									</span>
									<span className=" caption-1 text-gray-500 pb-1.5">
										<span>{`${product.size.toUpperCase()} / ${
											product.height
										} / ${product.genderCategory}`}</span>
									</span>
									<span className=" caption-1 text-gray-500 w-full flex gap-x-2 gap-y-1 flex-wrap">
										{product.styleCategory.map((style: string) => (
											<span key={style}>{style}</span>
										))}
									</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</main>
		</>
	);
}

// max-w-screen-2xl
