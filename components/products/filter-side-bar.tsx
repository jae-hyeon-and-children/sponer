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
        className="lg:hidden fixed top-20 right-0 z-50 text-2xl p-2 bg-gray-800 text-white rounded-md"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      <div
        className={`${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } fixed lg:translate-x-0  lg:flex flex-col px-7 pt-24 lg:pt-36 gap-7 w-72 border-r-2 border-gray-100 h-screen lg:h-auto lg:sticky top-0 bg-white transition-transform duration-300 ease-in-out z-40`}
        style={{ top: "72px" }}
      >
        <div className="flex flex-col gap-3">
          <h2 className="heading-3 text-gray-800">productCategory</h2>
          <CategoryRefinementList attribute="productCategory" />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="heading-3 text-gray-800">styleCategory</h2>
          <CategoryRefinementList attribute="styleCategory" />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="heading-3 text-gray-800">genderCategory</h2>
          <CategoryRefinementList attribute="genderCategory" />
        </div>
      </div>
    </div>
  );
}
