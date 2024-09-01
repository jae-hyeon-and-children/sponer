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
    <div className="flex flex-col gap-4 items-center p-4">
      <Image
        src={imageUrl}
        width={450}
        height={350}
        alt="상품 이미지"
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="flex flex-col items-center text-center">
        <h2 className="text-sm text-gray-500 mb-1">{brandName}</h2>
        <h1 className="text-base font-semibold text-gray-900 mb-1">{title}</h1>
        <div className="flex gap-1 items-center text-sm">
          <span className="text-gray-500">{PRODUCT_SIZE[size]}</span>
          <span className="text-gray-200">/</span>
          <span className="text-gray-500">{height}</span>
        </div>
        <div className="flex gap-x-2 gap-y-1 flex-wrap justify-center mt-2">
          {styleCategory.map((style) => (
            <span
              key={style}
              className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700"
            >
              {style}
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-500 mt-1">
          {PRODUCT_CATEGORIES[
            productCategory as keyof typeof PRODUCT_CATEGORIES
          ] || "카테고리 없음"}
        </span>
      </div>
    </div>
  );
}
