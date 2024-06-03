import {
  chatRoomIdState,
  chatRoomUserState,
  showProductsState,
} from "@/recoil/atoms";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function MessageHeader() {
  const [loading, setLoading] = useState(true);
  const chatRoomUser = useRecoilValue(chatRoomUserState);
  const setShowProducts = useSetRecoilState(showProductsState);

  useEffect(() => {
    if (chatRoomUser) setLoading(false);
  }, [chatRoomUser]);

  const handleShowProducts = () => setShowProducts((prev) => !prev);

  if (loading) return <Skeleton />;

  return (
    <div className="sticky top-0 bg-white border-b border-b-gray-200 flex justify-between items-center py-3 px-5">
      <div className="flex gap-4 items-center">
        <Image
          src={chatRoomUser!.profileImage}
          width={24}
          height={24}
          alt={"상품 이미지"}
          className=" rounded-full w-6 h-6 object-cover"
        />
        <h2 className="heading-2 truncate text-gray-800">
          {chatRoomUser!.name}
        </h2>
      </div>
      <button
        onClick={handleShowProducts}
        className="caption text-gray-700 rounded-lg py-2 px-3 bg-gray-100 whitespace-nowrap"
      >
        상품 보기
      </button>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="sticky top-0 bg-white border-b border-b-gray-200 flex justify-between items-center py-3 px-5">
      <div className="flex gap-4 items-center w-full">
        <div className=" rounded-full w-6 h-6 object-cover bg-slate-100 flex-shrink-0"></div>
        <h2 className="w-full max-w-64 h-5 bg-slate-100 rounded-sm"></h2>
      </div>
    </div>
  );
}
