import {
  PRODUCT_SIZE,
  PRODUCT_STYLES,
  PRODUCT_TYPES,
} from "@/constants/variables";
import { getProduct } from "@/libs/api/product";
import { chatRoomProductState, showProductsState } from "@/recoil/atoms";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import Image from "next/image";

export default function ProductsSetction() {
  const [loading, setLoading] = useState(true);
  const chatRoomProduct = useRecoilValue(chatRoomProductState);
  const showProducts = useRecoilValue(showProductsState);
  const imageListRef = useRef<HTMLUListElement>(null);
  const [imageCurrIndex, setImageCurrIndex] = useState(1);

  useEffect(() => {
    if (chatRoomProduct) setLoading(false);
  }, [chatRoomProduct]);

  if (loading) {
    return <div className={`${!showProducts && "hidden"}`}>로딩 중</div>;
  }

  if (!chatRoomProduct) {
    return (
      <div className={`${!showProducts && "hidden"}`}>
        해당 상품이 존재하지 않습니다.
      </div>
    );
  }
  const scrollLeft = () => {
    if (imageListRef.current && 1 < imageCurrIndex) {
      imageListRef.current.scrollBy({
        left: imageListRef.current.clientWidth * -1,
        behavior: "smooth",
      });
      setImageCurrIndex((prev) => prev - 1);
    }
  };

  const scrollRight = () => {
    if (
      imageListRef.current &&
      chatRoomProduct!.productImages.length > imageCurrIndex
    ) {
      imageListRef.current.scrollBy({
        left: imageListRef.current.clientWidth,
        behavior: "smooth",
      });
      setImageCurrIndex((prev) => prev + 1);
    }
  };

  return (
    <section
      className={`sticky top-0 overflow-y-scroll scrollbar-hide w-96 bg-white border-l border-l-gray-100 ${
        !showProducts && "hidden"
      }`}
    >
      <div className="px-6 py-5">
        <h1 className="label-1 text-gray-600">상품 정보</h1>
      </div>
      <div className="relative flex items-center justify-center w-full ">
        <ul className="flex gap-4 items-center overflow-x-scroll w-full">
          {chatRoomProduct.productImages.map((value, index) => (
            <Image
              key={index}
              src={value}
              width={465}
              height={500}
              alt={"상품 이미지"}
              className="w-full object-cover"
            />
          ))}
        </ul>
        <div className="flex justify-between absolute w-full px-2">
          <div
            onClick={scrollLeft}
            className="shrink-0 w-8 h-8 bg-white backdrop-blur-sm rounded-full flex justify-center items-center"
          >
            ◀
          </div>
          <div
            onClick={scrollRight}
            className="shrink-0 w-8 h-8 bg-white backdrop-blur-sm rounded-full flex justify-center items-center"
          >
            ▶
          </div>
        </div>
        <div className="caption absolute bottom-0 mb-3 px-3 py-0.5 rounded-full bg-white/60 backdrop-blur-sm flex justify-center">
          {imageCurrIndex} / {chatRoomProduct!.productImages.length}
        </div>
      </div>
      <section className="flex flex-col pt-6 w-full px-6 pb-12">
        <h1 className="display text-gray-900 mb-3">{chatRoomProduct.title}</h1>
        <hr className="mb-6" />
        <div className="">
          <h3 className="heading-3 text-gray-800 mb-4">Product Information</h3>
          <div className="grid grid-cols-1 gap-x-2 gap-y-6">
            <div className="flex flex-col gap-3">
              <h4 className="label-1  text-gray-800">Size</h4>
              <p className="label-2  text-gray-800">
                {PRODUCT_SIZE[chatRoomProduct.size]}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="label-1  text-gray-800">Height</h4>
              <p className="label-2  text-gray-800">{chatRoomProduct.height}</p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="label-1  text-gray-800">Types</h4>
              <p className="label-2  text-gray-800">
                {PRODUCT_TYPES[chatRoomProduct.genderCategory]}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="label-1  text-gray-800">Style</h4>
              <ul className="flex gap-x-3 gap-y-2 flex-wrap">
                {chatRoomProduct.styleCategory.map((value, index) => (
                  <li key={index} className="label-2  text-gray-800">
                    {PRODUCT_STYLES[value]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button className="label-3 text-gray-400 mt-8">사이즈 가이드</button>
        </div>
      </section>
    </section>
  );
}
