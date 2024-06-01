"use client";

import EmptyView from "@/components/global/empty-view";
import Footer from "@/components/global/footer";
import Header from "@/components/header";

import FilterModal from "@/components/products/filter-modal";
import ProductItem from "@/components/products/product-item";
import { PRODUCT_CATEGORIES_WITH_ALL } from "@/constants/variables";
import { getProducts } from "@/libs/api/products";

import { IProduct } from "@/model/product";
import IcSearch from "@/public/icons/ic_search.png";
import {
  showFilterModalState,
  styleFilterCategoryState,
  typeFilterCategoryState,
} from "@/recoil/atoms";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

interface ProductsParams {
  params: {
    category: string;
  };

  searchParams: {
    search: string;
    type: string;
    style: string | string[];
  };
}

export default function Products({
  params: { category },
  searchParams: { type, style, search: search },
}: ProductsParams) {
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(search);
  const [products, setProducts] = useState<IProduct[]>([]);
  const setShowFilterModal = useSetRecoilState(showFilterModalState);
  const [typeFilterCategory, setTypeFilterCategory] = useRecoilState(
    typeFilterCategoryState
  );
  const [styleFilterCategory, setStyleFilterCategory] = useRecoilState(
    styleFilterCategoryState
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const styleList = typeof style === "string" ? [style] : style;

    if (type !== undefined) setTypeFilterCategory(type);
    if (style !== undefined) setStyleFilterCategory(styleList);

    async function fetchAndSetUser() {
      const response = await getProducts(category, type, styleList, keyword);
      if (response.success) setProducts(response.data!);
    }

    fetchAndSetUser();
    setLoading(false);
  }, [
    category,
    keyword,
    setStyleFilterCategory,
    setTypeFilterCategory,
    style,
    type,
  ]);

  const handleShowFilterModal = () => setShowFilterModal(true);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const searchKeyword = formData.get("search") as string;
    setKeyword(searchKeyword);

    const params = new URLSearchParams(searchParams);
    params.set("search", searchKeyword);
    router.push(`/products/${category}?${params.toString()}`);
  };

  const resetCategory = () => {
    setTypeFilterCategory("all");
    setStyleFilterCategory([]);
  };

  return (
    <>
      <Header />
      <FilterModal />
      <main className="flex flex-col items-center px-4 ">
        <div className="max-w-screen-sm pt-16 lg:max-w-screen-2xl lg:pt-60 flex flex-col items-center w-full">
          <form
            onSubmit={handleSearch}
            className="w-full flex gap-4 items-center mb-6 px-4 py-4 border-b border-b-gray-300 lg:w-96 lg:mb-20 "
          >
            <Image
              src={IcSearch}
              alt="photo"
              width={20}
              height={20}
              className="w-4 h-4 shrink-0"
            />
            <input
              name="search"
              type="text"
              placeholder="Search"
              className="text-gray-800 placeholder-gray-300 paragraph-1 w-full "
            />
          </form>
          <section className="flex w-full mb-12 flex-row justify-between lg:mb-20 overflow-hidden gap-12">
            <ul className="flex whitespace-nowrap w-full overflow-x-scroll scrollbar-hide">
              {Object.entries(PRODUCT_CATEGORIES_WITH_ALL).map(
                ([key, value], index) => (
                  <Link
                    key={index}
                    href={`/products/${key}?type=all`}
                    onClick={() => resetCategory()}
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
                )
              )}
            </ul>
            <button
              className="label-1 text-gray-500 flex relative"
              onClick={handleShowFilterModal}
            >
              <p className="mr-2">Filters</p>
              <div
                className={`${
                  typeFilterCategory === "all" &&
                  styleFilterCategory.length === 0 &&
                  "hidden"
                } absolute right-0 bg-state-red w-1.5 h-1.5 rounded-full`}
              ></div>
            </button>
          </section>
          {loading ? (
            <ul>
              <li className="flex flex-col gap-6 items-center">
                <div className="w-full h-[40rem] object-cover"></div>
                <div className="flex flex-col items-center">
                  <div className="label-2 text-gray-500 mb-1 w-20 h-5"></div>
                  <div className="heading-3  text-gray-900 mb-1 w-20 h-5"></div>
                  <div className="flex gap-1 items-center">
                    <div className="caption  text-gray-500 w-20 h-5"></div>
                    <div className="caption  text-gray-200">/</div>
                    <div className="caption  text-gray-500 w-20 h-5"></div>
                  </div>
                </div>
              </li>
            </ul>
          ) : (
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
