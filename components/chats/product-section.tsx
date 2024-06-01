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
import IcArrowLeft from "@/public/icons/ic_arrow_left.png";
import IcArrowRight from "@/public/icons/ic_arrow_right.png";
import EmptyView from "../global/empty-view";

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

  const handlePrevClick = () => {
    if (imageListRef.current && imageCurrIndex > 1) {
      setImageCurrIndex(imageCurrIndex - 1);
      scrollToImage(imageCurrIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (
      imageListRef.current &&
      imageCurrIndex < chatRoomProduct!.productImages.length
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

  return (
    <section
      className={`sticky top-0 overflow-y-scroll scrollbar-hide w-96 bg-white border-l border-l-gray-100 ${
        !showProducts && "hidden"
      }`}
    >
      <div className="px-6 py-5">
        <h1 className="label-1 text-gray-600">상품 정보</h1>
      </div>
      {!chatRoomProduct ? (
        <EmptyView text="해당 상품이 존재하지 않습니다" />
      ) : (
        <>
          <section className="relative flex items-center justify-center">
            <ul
              ref={imageListRef}
              className="scrollbar-hide h-96 flex flex-row gap-4 items-center overflow-x-scroll overflow-y-hidden snap-x snap-mandatory"
            >
              {chatRoomProduct.productImages.map((value, index) => (
                <Image
                  key={index}
                  src={value}
                  width={465}
                  height={500}
                  alt={"상품 이미지"}
                  className="w-full object-cover snap-center"
                />
              ))}
            </ul>
            {chatRoomProduct!.productImages.length > 1 && (
              <>
                <div className="flex justify-between absolute w-full px-2">
                  <button
                    onClick={handlePrevClick}
                    className="shrink-0 w-9 h-9 bg-white backdrop-blur-sm rounded-full flex justify-center items-center"
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
                    className="shrink-0 w-9 h-9 bg-white backdrop-blur-sm rounded-full flex justify-center items-center"
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
                  className={`gap-1.5 absolute bottom-0 mb-5 rounded-full flex lg:hidden items-center`}
                >
                  {Array.from({
                    length: chatRoomProduct!.productImages.length,
                  }).map((_, index) => (
                    <button
                      onClick={() => {
                        setImageCurrIndex(index + 1);
                        scrollToImage(index + 1);
                      }}
                      key={index}
                      className={`${
                        imageCurrIndex === index + 1 ? "w-4 h-1.5" : "w-2 h-2"
                      }  ${
                        imageCurrIndex === index + 1
                          ? "bg-white"
                          : "bg-gray-900/50"
                      } rounded-full backdrop-blur-sm`}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </section>
          <section className="flex flex-col pt-6 w-full px-6 pb-12">
            <h1 className="display text-gray-900 mb-3">
              {chatRoomProduct.title}
            </h1>
            <hr className="mb-6" />
            <div className="">
              <h3 className="heading-3 text-gray-800 mb-4">
                Product Information
              </h3>
              <div className="grid grid-cols-1 gap-x-2 gap-y-6">
                <div className="flex flex-col gap-3">
                  <h4 className="label-1  text-gray-800">Size</h4>
                  <p className="label-2  text-gray-800">
                    {PRODUCT_SIZE[chatRoomProduct.size]}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="label-1  text-gray-800">Height</h4>
                  <p className="label-2  text-gray-800">
                    {chatRoomProduct.height}
                  </p>
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
              <button className="label-3 text-gray-400 mt-8">
                사이즈 가이드
              </button>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
