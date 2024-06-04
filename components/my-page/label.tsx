import React from "react";

interface ProductLabelProps {
	list: {
		[key: string]: string;
	};
	multiple?: boolean;
	selectedItems: string[];
	onSelect: (item: string) => void;
}

export const ProductLabel: React.FC<ProductLabelProps> = ({
	list,
	multiple = false,
	selectedItems,
	onSelect,
}) => {
	return (
		<div className="flex gap-[0.75rem] flex-wrap">
			{Object.entries(list).map(([key, value]) => (
				<div
					className={`text-gray-400 border border-gray-200 py-2 px-4 rounded-3xl cursor-pointer ${
						selectedItems.includes(value)
							? "bg-primary text-gray-100"
							: "bg-white"
					}`}
					key={value}
					onClick={() => onSelect(value)}
				>
					{value}
				</div>
			))}
		</div>
	);
};
