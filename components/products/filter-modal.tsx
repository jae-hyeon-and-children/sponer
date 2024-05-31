import { PRODUCT_STYLES, PRODUCT_TYPES_WITH_ALL } from "@/constants/variables";
import {
  typeFilterCategoryState,
  showFilterModalState,
  styleFilterCategoryState,
} from "@/recoil/atoms";
import { useRecoilValue, useRecoilState } from "recoil";

export default function FilterModal() {
  const [showFilterModal, setShowFilterModal] =
    useRecoilState(showFilterModalState);
  const [typeFilterCategory, setTypeFilterCategory] = useRecoilState(
    typeFilterCategoryState
  );
  const [styleFilterCategory, setStyleFilterCategory] = useRecoilState(
    styleFilterCategoryState
  );

  const closeFilterModal = () => setShowFilterModal(false);
  const resetCategory = () => {
    setTypeFilterCategory("all");
    setStyleFilterCategory([]);
  };

  return (
    <section
      className={`w-screen h-screen fixed flex justify-end z-20 ${
        !showFilterModal && "hidden"
      }`}
    >
      <div
        onClick={closeFilterModal}
        className="bg-gray-700/30 w-full h-full backdrop-blur-sm"
      ></div>
      <form className="bg-white h-full w-96 max-w-[90%] flex flex-col pt-10">
        <div className="px-6 flex-1 flex flex-col gap-6">
          <div>
            <h1 className="heading-3 text-gray-800 mb-3">Type</h1>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {Object.entries(PRODUCT_TYPES_WITH_ALL).map(
                ([key, value], index) => (
                  <li
                    key={index}
                    className="cursor-pointer flex flex-wrap items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="type"
                      id={key}
                      value={key}
                      defaultChecked={typeFilterCategory === key}
                      className="cursor-pointer appearance-none w-4 h-4 rounded-full bg-gray-100 border-gray-300 checked:bg-primary checked:border-gray-100 checked:border-[3px] "
                    />
                    <label
                      className="cursor-pointer label-2 text-gray-400"
                      htmlFor={key}
                    >
                      {value}
                    </label>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h1 className="heading-3 text-gray-800 mb-3">Style</h1>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {Object.entries(PRODUCT_STYLES).map(([key, value], index) => (
                <li
                  key={index}
                  className="cursor-pointer flex flex-wrap items-center gap-2"
                >
                  <input
                    className="cursor-pointer appearance-none w-4 h-4 rounded-sm bg-gray-100 border-gray-300 checked:bg-primary "
                    type="checkbox"
                    name="style"
                    id={key}
                    value={key}
                    defaultChecked={styleFilterCategory.includes(key)}
                  />
                  <label
                    className="cursor-pointer label-2 text-gray-400"
                    htmlFor={key}
                  >
                    {value}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={resetCategory}
            type="reset"
            className="flex-1 p-4 bg-gray-50 label-1 text-gray-300"
          >
            전체 해제
          </button>
          <button
            className="flex-1 p-4 bg-primary label-1 text-gray-100"
            type="submit"
          >
            적용하기
          </button>
        </div>
      </form>
    </section>
  );
}
