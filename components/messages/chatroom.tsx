import Image from "next/image";
import Link from "next/link";

export default function ChatRoom() {
  return (
    <li className="flex bg w-full bg-white p-5 rounded-lg items-center">
      <Image
        src={
          "https://flexible.img.hani.co.kr/flexible/normal/700/1040/imgdb/original/2021/0428/20210428504000.jpg"
        }
        width={24}
        height={24}
        alt={"상품 이미지"}
        className="mr-4 rounded-full w-9 h-9 object-cover"
      />

      <div className="flex flex-col gap-1 flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline gap-2">
          <h2 className="heading-3 text-gray-500">오아이</h2>
          <span className="label-3 text-gray-300">14분 전</span>
        </div>
        <p className="paragraph-2 text-gray-400 truncate">
          안녕하세요? xs사이즈 있나요? 저희가 좀 급해서 그런데 xs사이즈로된 옷
          100개만 주실 수 있을까요? 이정도는 해주실 수 있잖아요? ^^
        </p>
      </div>
    </li>
  );
}
