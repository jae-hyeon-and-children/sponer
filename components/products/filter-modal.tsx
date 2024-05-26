import { PRODUCT_STYLES, PRODUCT_TYPES_WITH_ALL } from "@/constants/variables";
import { showFilterModalState } from "@/recoil/atoms";
import { useState } from "react";
import { useRecoilValue } from "recoil";

export default function FilterModal() {
  //const [search, setSearch] = useState("");
  //const [type, setType] = useState("");
  // const handleChange = (e) => setSearch(e.target.value);
  //const typeChange = (e: SelectChangeEvent) => setType(e.target.value);
  // const clickSearch = async () => {};
  const showFilterModal = useRecoilValue(showFilterModalState);

  return (
    <section
      className={`bg-gray-700/30 w-screen h-screen fixed backdrop-blur-sm flex justify-end ${
        !showFilterModal && "hidden"
      }`}
    >
      <form className="bg-white h-full w-96 max-w-[90%] flex flex-col pt-10">
        <div className="px-6 flex-1 flex flex-col gap-6">
          <div>
            <h1 className="heading-3 text-gray-800 mb-3">Type</h1>
            <ul className="flex flex-wrap gap-4">
              {Object.entries(PRODUCT_TYPES_WITH_ALL).map(
                ([key, value], index) => (
                  <li
                    key={index}
                    className="label-2 text-gray-400 flex flex-wrap items-center gap-1"
                  >
                    <input
                      type="radio"
                      name="type"
                      id={key}
                      value={key}
                      className="w-3 h-3 bg-gray-100 border-gray-300 focus:ring-primary focus:ring-1 "
                    />
                    <label htmlFor={key}>{value}</label>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h1 className="heading-3 text-gray-800 mb-3">Style</h1>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {Object.entries(PRODUCT_STYLES).map(([key, value], index) => (
                <li
                  key={index}
                  className="label-2 text-gray-400 flex flex-wrap items-center gap-1"
                >
                  <input type="checkbox" name="style" id={key} value={key} />
                  <label htmlFor={key}>{value}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex">
          <button
            className="flex-1 p-4 bg-gray-50 label-1 text-gray-300"
            type="reset"
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
