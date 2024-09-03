import Input from "@/components/global/input";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZE,
  PRODUCT_STYLES,
  PRODUCT_TYPES,
  PRODUCT_HEIGHT,
} from "@/constants/variables";
import { ProductLabel } from "../label";

interface ProductDetailsProps {
  initialData?: any;
  selectedType: string | null;
  selectedSize: string | null;
  selectedGender: string | null;
  selectedStyles: string[];
  selectedHeight?: string | null;
  errors: Record<string, string>;
  selectType: (item: string) => void;
  selectSize: (item: string) => void;
  selectGender: (item: string) => void;
  toggleStyle: (item: string) => void;
  handleShowModal: () => void;
}

export function ProductDetails({
  initialData,
  selectedType,
  selectedSize,
  selectedGender,
  selectedStyles,
  selectedHeight,
  errors,
  selectType,
  selectSize,
  selectGender,
  toggleStyle,
  handleShowModal,
}: ProductDetailsProps) {
  return (
    <div>
      <div className="w-full md:w-[36rem] mt-12 label-1 flex flex-col gap-3">
        <div>상품 이름 *</div>
        <Input
          name="productName"
          count={40}
          defaultValue={initialData?.title || ""}
        />
        {errors.productName && (
          <span className="text-red-500">{errors.productName}</span>
        )}
      </div>
      <div className="w-full flex flex-col gap-[0.75rem] label-1 mt-[3.75rem]">
        <div className="font-bold">상품 종류 (1개 선택) *</div>
        <ProductLabel
          list={PRODUCT_CATEGORIES}
          selectedItems={selectedType ? [selectedType] : []}
          onSelect={selectType}
        />
      </div>
      <div className="w-full flex flex-col gap-[0.75rem] label-1">
        <div className="font-bold flex-col md:flex-row gap-[0.75rem] mt-[3.75rem]">
          <span>상품 사이즈 *</span>
          <span
            onClick={handleShowModal}
            className="label-3 text-gray-400 mt-8 underline cursor-pointer"
          >
            사이즈 가이드
          </span>
        </div>
        <ProductLabel
          list={PRODUCT_SIZE}
          selectedItems={selectedSize ? [selectedSize] : []}
          onSelect={selectSize}
        />
        {errors.productSize && (
          <span className="text-red-500">{errors.productSize}</span>
        )}
      </div>
      <div className="w-full flex flex-col gap-[0.75rem] label-1">
        <div className="w-full md:w-[36rem] mt-[3rem] label-1 flex flex-col gap-[12px]">
          <div>맞춤 키 *</div>
          <select
            defaultValue={selectedHeight || ""}
            name="height"
            className="text-gray-800 py-5 px-4 rounded-md focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none"
          >
            <option>사이즈를 선택하세요.</option>
            {Object.entries(PRODUCT_HEIGHT).map(([key, value]) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
        {errors.productHeight && (
          <span className="text-red-500">{errors.productHeight}</span>
        )}
      </div>
      <div className="w-full flex flex-col gap-[0.75rem] label-1">
        <div className="font-bold flex gap-[0.75rem] mt-[3.75rem]">
          분류(1개 선택) *
        </div>
        <ProductLabel
          list={PRODUCT_TYPES}
          selectedItems={selectedGender ? [selectedGender] : []}
          onSelect={selectGender}
        />
        {errors.productGender && (
          <span className="text-red-500">{errors.productGender}</span>
        )}
      </div>
      <div className="w-full flex flex-col gap-[0.75rem] label-1">
        <div className="font-bold flex gap-[0.75rem] mt-[3.75rem]">
          스타일(최소 1개, 중복 가능) *
        </div>
        <ProductLabel
          list={PRODUCT_STYLES}
          selectedItems={selectedStyles ? selectedStyles : []}
          onSelect={toggleStyle}
        />
        {errors.productStyles && (
          <span className="text-red-500">{errors.productStyles}</span>
        )}
      </div>
    </div>
  );
}
