import { useState } from "react";
import CategoryRefinementList from "./category-refinement-list";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function FilterSideBar() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-20 right-2 z-50 text-2xl p-2 bg-gray-800 text-white rounded-md"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      <div
        className={`${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } fixed lg:translate-x-0 lg:flex flex-col top-[75px] px-6 pt-20 lg:pt-28 gap-6 w-64 border-r-2  bg-gray-100  h-screen lg:h-screen lg:sticky transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col gap-8 mt-5">
          <h2 className="heading-3 text-gray-800">Product Category</h2>
          <CategoryRefinementList attribute="productCategory" />
        </div>
        <div className="flex flex-col gap-8 mt-5">
          <h2 className="heading-3 text-gray-800">Style Category</h2>
          <CategoryRefinementList attribute="styleCategory" />
        </div>
        <div className="flex flex-col gap-8 mt-5">
          <h2 className="heading-3 text-gray-800">Gender Category</h2>
          <CategoryRefinementList attribute="genderCategory" />
        </div>
      </div>
    </div>
  );
}
