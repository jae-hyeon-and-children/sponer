import CategoryRefinementList from "./category-refinement-list";

export default function FilterSideBar() {
  return (
    <div className="flex flex-col px-7 pt-24 lg:pt-36 gap-7 w-72 border-r-2 border-gray-100 h-screen sticky top-0">
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
  );
}
