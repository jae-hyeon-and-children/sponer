import { showProductsState } from "@/recoil/atoms";
import { useState } from "react";
import { useRecoilValue } from "recoil";

export default function ProductsSetction() {
  const showProducts = useRecoilValue(showProductsState);
  return (
    <section
      className={`sticky top-0 overflow-y-scroll scrollbar-hide w-96 bg-white px-6 py-8 border-r border-r-gray-200 ${
        showProducts && "hidden"
      }`}
    >
      <h1 className="label-1 text-gray-600 mb-8">상품 기록</h1>
      <ul className="flex flex-col gap-4">
        <li>
          <p> 상품 이름</p>
          <p>날짜</p>
        </li>
      </ul>
    </section>
  );
}
