import { showProductsState } from "@/recoil/atoms";
import Image from "next/image";
import { useSetRecoilState } from "recoil";

export default function MessageHeader() {
  const setShowProducts = useSetRecoilState(showProductsState);

  const handleShowProducts = () => setShowProducts((prev) => !prev);

  return (
    <div className="sticky top-0 bg-white border-b border-b-gray-200 flex justify-between items-center py-3 px-5">
      <div className="flex gap-4 items-center">
        <Image
          src={
            "https://flexible.img.hani.co.kr/flexible/normal/700/1040/imgdb/original/2021/0428/20210428504000.jpg"
          }
          width={24}
          height={24}
          alt={"상품 이미지"}
          className=" rounded-full w-6 h-6 object-cover"
        />
        <h2 className="heading-2 text-gray-800">오아이</h2>
      </div>
      <button
        onClick={handleShowProducts}
        className="caption text-gray-700 rounded-lg py-2 px-3 bg-gray-100"
      >
        상품 보기
      </button>
    </div>
  );
}
