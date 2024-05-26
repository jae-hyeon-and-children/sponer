import { PRODUCT_STYLES, PRODUCT_TYPES_WITH_ALL } from "@/constants/variables";
import { useState } from "react";

export default function FilterModal() {
  //const [search, setSearch] = useState("");
  //const [type, setType] = useState("");
  // const handleChange = (e) => setSearch(e.target.value);
  //const typeChange = (e: SelectChangeEvent) => setType(e.target.value);
  // const clickSearch = async () => {};
  return (
    <section className="bg-gray-700/30 w-screen h-screen fixed backdrop-blur-sm flex justify-end">
      <form className="bg-white h-full w-96 flex flex-col">
        <div className="p-6 flex-1">
          <div>
            <h1>Type</h1>
            <ul className="flex flex-wrap gap-4">
              {Object.entries(PRODUCT_TYPES_WITH_ALL).map(
                ([key, value], index) => (
                  <li key={index}>
                    <input type="radio" name="type" id={key} value={key} />
                    <label htmlFor={key}>{value}</label>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h1>Style</h1>
            <ul className="flex flex-wrap gap-4">
              {Object.entries(PRODUCT_STYLES).map(([key, value], index) => (
                <li key={index}>
                  <input type="checkbox" name="style" id={key} value={key} />
                  <label htmlFor={key}>{value}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex">
          <button className="flex-1 p-2 bg-gray-50" type="reset">
            전체 해제
          </button>
          <button className="flex-1 p-2 bg-primary" type="submit">
            적용하기
          </button>
        </div>
      </form>
    </section>
  );
}
