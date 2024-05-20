import FilterModal from "@/components/products/filter-modal";
import ProductItem from "@/components/products/product-item";
import {
  PRODUCT_CATEGORIES_WITH_ALL,
  PRODUCT_STYLES,
  PRODUCT_TYPES_WITH_ALL,
} from "@/constants/variables";
import { getProducts } from "@/lib/api/products";
import Image from "next/image";
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
      <div className="max-w-screen-2xl pt-60 flex flex-col items-center w-full">
        <form className="px-4 py-4 border-b border-b-gray-300 w-96 mb-20 ">
          <input
            type="text"
            placeholder="Search"
            className="text-gray-800 placeholder-gray-300 paragraph-1 w-full "
          />
        </form>
        <section className="flex w-full flex-col lg:flex-row lg:justify-between mb-20">
          <ul className="flex gap-5">
            {Object.entries(PRODUCT_CATEGORIES_WITH_ALL).map((value, index) => (
              <>
                <Link key={index} href={`/products/${value[0]}`}>
                  <li className="text-gray-300 hover:text-primary">
                    {value[1]}
                  </li>
                </Link>
                <span className="text-gray-100 label-1">/</span>
              </>
            ))}
          </ul>
          <button>Filters</button>
        </section>
        <ul className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20">
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
      </div>
    </main>
  );
}
