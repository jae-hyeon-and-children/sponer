"use client";

import Footer from "@/components/global/footer";
import {
  PRODUCT_SIZE,
  PRODUCT_STYLES,
  PRODUCT_TYPES,
} from "@/constants/variables";
import { getProduct } from "@/libs/api/product";
import { IProduct } from "@/model/product";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import IcArrowLeft from "@/public/icons/ic_arrow_left.png";
import IcArrowRight from "@/public/icons/ic_arrow_right.png";
import { getBrand } from "@/libs/api/brand";
import { IUser } from "@/model/user";

interface ProductDetailParams {
  params: {
    id: string;
  };
}

export default function Product({ params: { id } }: ProductDetailParams) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<IProduct | null>(null);

  export default function Product({ params: { id } }: ProductDetailParams) {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<IProduct | null>(null);
    const [brand, setBrand] = useState<IUser | null>(null);
    const imageListRef = useRef<HTMLUListElement>(null);
    const [imageCurrIndex, setImageCurrIndex] = useState(1);

    useEffect(() => {
      async function fetchProduct() {
        const productResponse = await getProduct(id);

        if (productResponse.success) {
          setProduct(productResponse.data!);
          const brandResponse = await getBrand(productResponse.data!.brandId);
          if (brandResponse.success) {
            setBrand(brandResponse.data!);
          }
        }
      }
      fetchProduct();
      setLoading(false);
    }, [id]);

    useEffect(() => {
      const handleResize = () => {
        console.log("resize");
        scrollToImage(imageCurrIndex);
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [imageCurrIndex]);

    const handlePrevClick = () => {
      if (imageListRef.current && imageCurrIndex > 1) {
        setImageCurrIndex(imageCurrIndex - 1);
        scrollToImage(imageCurrIndex - 1);
      }
    };

    const handleNextClick = () => {
      if (
        imageListRef.current &&
        imageCurrIndex < product!.productImages.length
      ) {
        setImageCurrIndex(imageCurrIndex + 1);
        scrollToImage(imageCurrIndex + 1);
      }
    };

    const scrollToImage = (index: number) => {
      if (imageListRef.current) {
        const child = imageListRef.current.children[index - 1] as HTMLElement;
        if (child) {
          const scrollPosition = child.offsetLeft;
          imageListRef.current.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
        }
      }
    };

    if (loading || !product) return <div>로딩 중</div>;

    return (
      <>
        <main className="flex flex-col items-center px-4">
          <div className="max-w-screen-sm lg:max-w-screen-2xl flex gap-x-36 w-full flex-col lg:flex-row">
            <section className="relative flex items-center justify-center lg:flex-1 mt-16 lg:mt-60">
              <ul
                ref={imageListRef}
                className="scrollbar-hide flex flex-row lg:flex-col gap-4 lg:gap-52 items-center overflow-x-scroll snap-x snap-mandatory"
              >
                {product!.productImages.map((value, index) => (
                  <Image
                    key={index}
                    src={value}
                    width={465}
                    height={500}
                    alt={"상품 이미지"}
                    className="w-full lg:h-[56rem] object-cover snap-center "
                  />
                ))}
              </ul>
              <div className="flex justify-between absolute lg:hidden w-full px-2">
                <button
                  onClick={handlePrevClick}
                  className="shrink-0 w-10 h-10 bg-white backdrop-blur-sm rounded-full flex justify-center items-center"
                >
                  <Image
                    src={IcArrowLeft}
                    alt="IcArrowLeft"
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  onClick={handleNextClick}
                  className="shrink-0 w-10 h-10 bg-white backdrop-blur-sm rounded-full flex justify-center items-center"
                >
                  <Image
                    src={IcArrowRight}
                    alt="IcArrowLeft"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <div
                className={`gap-1.5 absolute bottom-0 mb-5 rounded-full flex justify-center lg:hidden`}
              >
                {Array.from({ length: product!.productImages.length }).map(
                  (_, index) => (
                    <button
                      onClick={() => {
                        setImageCurrIndex(index + 1);
                        scrollToImage(index + 1);
                      }}
                      key={index}
                      className={` w-2 h-2  ${
                        imageCurrIndex === index + 1
                          ? "bg-white"
                          : "bg-gray-900/50"
                      } rounded-full backdrop-blur-sm`}
                    ></button>
                  )
                )}
              </div>
            </section>
            <section className="flex-1 flex flex-col lg:sticky lg:top-0 pt-16 lg:pt-60 h-fit">
              <div className="mb-4 flex flex-wrap gap-3 items-center">
                <div className="w-5 y-5 rounded-full shrink-0 overflow-hidden">
                  <Image
                    src={brand?.profileImage!}
                    alt="IcArrowLeft"
                    width={20}
                    height={20}
                    className="w-full y-full object-cover"
                  />
                </div>
                <h2 className="label-1 text-gray-800 ">{brand?.brandName!}</h2>
              </div>
              <h1 className="display  text-gray-900 mb-3">{product!.title}</h1>
              <hr className="mb-12" />
              <div className="">
                <h3 className="heading-3 text-gray-800 mb-4">
                  Product Information
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-6">
                  <div className="flex flex-col gap-3">
                    <h4 className="label-1  text-gray-800">Size</h4>
                    <p className="label-2  text-gray-800">
                      {PRODUCT_SIZE[product!.size]}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="label-1  text-gray-800">Height</h4>
                    <p className="label-2  text-gray-800">{product!.height}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="label-1  text-gray-800">Types</h4>
                    <p className="label-2  text-gray-800">
                      {PRODUCT_TYPES[product!.genderCategory]}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="label-1  text-gray-800">Style</h4>
                    <ul className="flex gap-x-3 gap-y-2 flex-wrap">
                      {product!.styleCategory.map((value, index) => (
                        <li key={index} className="label-2  text-gray-800">
                          {PRODUCT_STYLES[value]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button className="label-3 text-gray-400 mt-8">
                  사이즈 가이드
                </button>
              </div>
              <Link href={`/chats`}>
                <button className="label-1 text-white mt-20 p-4 bg-primary rounded-full w-full lg:max-w-60">
                  브랜드에게 연락하기
                </button>
              </Link>
            </section>
          </div>
        </main>
        <Footer />
      </>
    );
  }
}
