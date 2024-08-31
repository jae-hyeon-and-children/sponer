import Link from "next/link";
import Image from "next/image";
import { PRODUCT_CATEGORIES, PRODUCT_SIZE } from "@/constants/variables";

interface ProductItemProps {
  imageUrl: string;
  title: string;
  size: string;
  height: string;
  brandName: string;
  styleCategory: string[];
  productCategory: string;
}

export default function ProductItem({
  imageUrl,
  title,
  size,
  height,
  brandName,
  styleCategory,
  productCategory,
}: ProductItemProps) {
  return (
    <li className="flex flex-col gap-6 items-center">
      <Image
        src={imageUrl}
        width={465}
        height={500}
        alt={"상품 이미지"}
        className="w-full h-96 md:h-[40rem] object-cover"
      />
      <div className="flex flex-col items-center">
        <h2 className="label-2 text-gray-500 mb-1">{brandName}</h2>
        <h1 className="heading-3  text-gray-900 mb-1">{title}</h1>
        <div className="flex gap-1 items-center">
          <span className="caption  text-gray-500">{PRODUCT_SIZE[size]}</span>
          <span className="caption  text-gray-200">/</span>
          <span className="caption  text-gray-500">{height}</span>
        </div>
        <div className="flex gap-x-2 gap-y-1 flex-wrap justify-center mt-2 mb-2">
          {styleCategory.map((style) => (
            <span
              key={style}
              className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700"
            >
              {style}
            </span>
          ))}
        </div>
        <span className="caption text-gray-500">
          {PRODUCT_CATEGORIES[
            productCategory as keyof typeof PRODUCT_CATEGORIES
          ] || "카테고리 없음"}
        </span>
      </div>
    </li>
  );
}
