import EmptyView from "@/components/global/empty-view";
import FilterModal from "@/components/products/filter-modal";
import ProductItem from "@/components/products/product-item";
import {
  PRODUCT_CATEGORIES_WITH_ALL,
  PRODUCT_STYLES,
  PRODUCT_TYPES_WITH_ALL,
} from "@/constants/variables";
import { getProducts } from "@/lib/api/products";

import Link from "next/link";
import { useState } from "react";

interface ProductsParams {
  params: {
    category: string;
  };
}

export default async function Products({
  params: { category },
}: ProductsParams) {
  //const [showFilterModal, setShowFilterModal] = useState(false);
  const response = await getProducts(category);
  console.log(response);
  return (
    <main className="flex flex-col items-center px-4 ">
      <div className="max-w-screen-sm pt-16 lg:max-w-screen-2xl lg:pt-60 flex flex-col items-center w-full">
        <form className="w-full mb-6 px-4 py-4 border-b border-b-gray-300 lg:w-96 lg:mb-20 ">
          <input
            type="text"
            placeholder="Search"
            className="text-gray-800 placeholder-gray-300 paragraph-1 w-full "
          />
        </form>
        <section className="flex w-full mb-12 flex-row justify-between lg:mb-20 overflow-hidden gap-12">
          <ul className="flex gap-3 lg:gap-5 whitespace-nowrap w-full overflow-x-scroll scrollbar-hide">
            {Object.entries(PRODUCT_CATEGORIES_WITH_ALL).map((value, index) => (
              <>
                <Link key={index} href={`/products/${value[0]}`}>
                  <li
                    className={`label-2 ${
                      value[0] === category ? "text-primary" : "text-gray-300 "
                    }`}
                  >
                    {value[1]}
                  </li>
                </Link>
                <span className="text-gray-100 label-1">/</span>
              </>
            ))}
          </ul>
          <button className="label-1 text-gray-500">Filters</button>
        </section>
        {response.data!.length === 0 ? (
          <EmptyView text="해당 상품이 없습니다" />
        ) : (
          <ul className=" w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-20 w-">
            {response.data!.map((value, index) => (
              <Link key={index} href={`/product/${value.id}`}>
                <ProductItem
                  imageUrl={value.productImages[0]}
                  title={value.title}
                  size={value.size}
                  height={value.height}
                />
              </Link>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
