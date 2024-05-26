"use client";

import EmptyView from "@/components/global/empty-view";
import Footer from "@/components/global/footer";

import FilterModal from "@/components/products/filter-modal";
import ProductItem from "@/components/products/product-item";
import { PRODUCT_CATEGORIES_WITH_ALL } from "@/constants/variables";
import { getProducts } from "@/libs/api/products";

import { IProduct } from "@/model/product";
import { IResponse } from "@/model/responses";
import IcSearch from "@/public/icons/ic_search.png";
import { showFilterModalState } from "@/recoil/atoms";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

interface ProductsParams {
  params: {
    category: string;
  };

  searchParams: {
    type: string;
    style: string[];
  };
}

export default function Products({
  params: { category },
  searchParams: { type, style },
}: ProductsParams) {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const setShowFilterModal = useSetRecoilState(showFilterModalState);

  useEffect(() => {
    async function fetchAndSetUser() {
      const response = await getProducts(category, type, style, keyword);
      if (response.success) setProducts(response.data!);
    }
    fetchAndSetUser();
    setLoading(false);
  }, [category, keyword, style, type]);

  const handleShowFilterModal = () => setShowFilterModal(true);

  if (loading) return <div>로딩 중</div>;

  return (
    <>
      <FilterModal />
      <main className="flex flex-col items-center px-4 ">
        <div className="max-w-screen-sm pt-16 lg:max-w-screen-2xl lg:pt-60 flex flex-col items-center w-full">
          <form className="w-full flex gap-4 items-center mb-6 px-4 py-4 border-b border-b-gray-300 lg:w-96 lg:mb-20 ">
            <Image
              src={IcSearch}
              alt="photo"
              width={20}
              height={20}
              className="w-4 h-4 shrink-0"
            />
            <input
              type="text"
              placeholder="Search"
              className="text-gray-800 placeholder-gray-300 paragraph-1 w-full "
            />
          </form>
          <section className="flex w-full mb-12 flex-row justify-between lg:mb-20 overflow-hidden gap-12">
            <ul className="flex whitespace-nowrap w-full overflow-x-scroll scrollbar-hide">
              {Object.entries(PRODUCT_CATEGORIES_WITH_ALL).map(
                ([key, value], index) => (
                  <>
                    <Link
                      key={index}
                      href={`/products/${key}`}
                      className="flex [&:not(:last-child)]:after:content-['/'] after:text-gray-200 after:label-1 after:mx-3 lg:after:mx-5"
                    >
                      <li
                        className={`
                        label-2 ${
                          key === category ? "text-primary" : "text-gray-300"
                        } `}
                      >
                        {value}
                      </li>
                    </Link>
                  </>
                )
              )}
            </ul>
            <button
              className="label-1 text-gray-500"
              onClick={handleShowFilterModal}
            >
              Filters
            </button>
          </section>
          <section className="w-full">
            {products.length === 0 ? (
              <EmptyView text="해당 상품이 없습니다" />
            ) : (
              <ul className=" w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-20 w-">
                {products.map((value, index) => (
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
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
