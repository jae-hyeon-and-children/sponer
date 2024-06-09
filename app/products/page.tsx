"use client";

import Footer from "@/components/global/footer";
import Header from "@/components/global/header";
import FilterSideBar from "@/components/products/filter-side-bar";
import ProductHits from "@/components/products/product-hits";
import ProductSearchBox from "@/components/products/product-search-box";
import searchClient from "@/config/algolia/algolia";
import { InstantSearch } from "react-instantsearch";

export default function Products() {
  return (
    <>
      <InstantSearch searchClient={searchClient} indexName={"Product"}>
        <main className="flex">
          <FilterSideBar />
          <div className="pt-24 px-4 lg:pt-36 flex justify-center w-full">
            <div className="max-w-screen-sm lg:max-w-screen-xl flex flex-col items-center w-full ">
              <ProductSearchBox />
              <ProductHits />
            </div>
          </div>
        </main>
      </InstantSearch>
    </>
  );
}
