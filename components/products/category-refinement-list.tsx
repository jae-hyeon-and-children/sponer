import React from "react";
import { useRefinementList, UseRefinementListProps } from "react-instantsearch";

export default function CategoryRefinementList(props: UseRefinementListProps) {
  const { items, refine } = useRefinementList(props);

  return (
    <ul className="flex flex-wrap gap-3">
      {items.map((item) => (
        <li key={item.label}>
          <label className="flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => refine(item.value)}
              className="w-4 h-4 rounded-sm border-gray-300 text-primary focus:ring-primary  checked:bg-primary checked:border-primary transition-all duration-200 ease-in-out cursor-pointer "
            />
            <div className="flex items-center gap-1">
              <span
                className={`text-sm ${
                  item.isRefined ? "text-primary font-medium" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-300">
                {item.count}
              </span>
            </div>
          </label>
        </li>
      ))}
    </ul>
  );
}
