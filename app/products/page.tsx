// "use client";

// import Footer from "@/components/global/footer";
// import Header from "@/components/global/header";
// import FilterSideBar from "@/components/products/filter-side-bar";
// import ProductHits from "@/components/products/product-hits";
// import ProductSearchBox from "@/components/products/product-search-box";
// import searchClient from "@/config/algolia/algolia";
// import { InstantSearch } from "react-instantsearch";

// export default function Products() {
//   return (
//     <>
//       <InstantSearch searchClient={searchClient} indexName={"Product"}>
//         <main className="flex">
//           <FilterSideBar />
//           <div className="pt-24 px-4 lg:pt-36 flex justify-center w-full">
//             <div className="max-w-screen-sm lg:max-w-screen-xl flex flex-col items-center w-full ">
//               <ProductSearchBox />
//               <ProductHits />
//             </div>
//           </div>
//         </main>
//       </InstantSearch>
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/global/footer";
import Header from "@/components/global/header";
import FilterSideBar from "@/components/products/filter-side-bar";
import ProductHits from "@/components/products/product-hits";
import ProductSearchBox from "@/components/products/product-search-box";
import searchClient from "@/config/algolia/algolia";
import { InstantSearch, SortBy } from "react-instantsearch";

// Skeleton for FilterSideBar
const SkeletonFilterSideBar = () => (
  <div className="w-64 p-4 border-r mt-20 border-gray-200">
    <div className="animate-pulse flex flex-col gap-4">
      {Array.from({ length: 15 }).map((_, index) => (
        <div key={index} className="h-6 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

// Skeleton for ProductSearchBox
const SkeletonProductSearchBox = () => (
  <div className="w-full max-w-md p-4">
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Skeleton for ProductHits
const SkeletonProductHits = () => (
  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10 p-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-lg mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

export default function Products() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <InstantSearch searchClient={searchClient} indexName={"Product"}>
        {/* <SortBy
          items={[
            { value: "Product", label: "Default" },
            { value: "Product_by_date_desc", label: "Newest First" }, // 커스텀 정렬 인덱스
          ]}
        /> */}
        <main className="flex">
          {isLoading ? <SkeletonFilterSideBar /> : <FilterSideBar />}
          <div className="pt-24 px-4 lg:pt-36 flex justify-center w-full">
            <div className="max-w-screen-sm lg:max-w-screen-xl flex flex-col items-center w-full">
              {isLoading ? (
                <>
                  <SkeletonProductSearchBox />
                  <SkeletonProductHits />
                </>
              ) : (
                <>
                  <ProductSearchBox />
                  <ProductHits />
                </>
              )}
            </div>
          </div>
        </main>
      </InstantSearch>
    </>
  );
}
