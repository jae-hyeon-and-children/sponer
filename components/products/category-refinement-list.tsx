import React from "react";
import { useRefinementList, UseRefinementListProps } from "react-instantsearch";

export default function CategoryRefinementList(props: UseRefinementListProps) {
  const { items, refine } = useRefinementList(props);

  return (
    <ul className="flex gap-x-3 gap-y-2 flex-wrap">
      {items.map((item) => (
        <li key={item.label}>
          <label className="flex flex-wrap items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => refine(item.value)}
              className="cursor-pointer appearance-none w-3.5 h-3.5 rounded-[3px] bg-gray-100 border-gray-300 checked:bg-primary "
            />
            <div className="flex flex-wrap items-center gap-1">
              <span
                className={`
                        label-2 ${
                          item.isRefined ? "text-primary" : "text-gray-400"
                        } `}
              >
                {item.label}
              </span>
              <span className="caption-2 text-gray-500 bg-gray-100 px-1 py-0.5 rounded-full">
                {item.count}
              </span>
            </div>
          </label>
        </li>
      ))}
    </ul>
  );
}
