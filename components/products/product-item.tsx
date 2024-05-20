import Link from "next/link";
import Image from "next/image";

interface ProductItemProps {
  imageUrl: string;
  title: string;
  size: string;
  height: string;
}

export default function ProductItem({
  imageUrl,
  title,
  size,
  height,
}: ProductItemProps) {
  return (
    <Link key={0} href={`/product/id`}>
      <li className="flex flex-col gap-6 items-center">
        <Image
          src={imageUrl}
          width={465}
          height={500}
          alt={"상품 이미지"}
          className="w-full h-[40rem] object-cover"
        />
        <div className="flex flex-col items-center">
          <h2 className="label-2 text-gray-500 mb-1">오와이</h2>
          <h1 className="heading-3  text-gray-900 mb-1">{title}</h1>
          <div className="flex gap-1 items-center">
            <span className="caption  text-gray-500">{size}</span>
            <span className="caption  text-gray-200">/</span>
            <span className="caption  text-gray-500">{height}</span>
          </div>
        </div>
      </li>
    </Link>
  );
}
