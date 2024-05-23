import { getProduct } from "@/lib/api/product";
import Image from "next/image";
import Link from "next/link";

interface ProductDetailParams {
  params: {
    id: string;
  };
}

export default async function Product({ params: { id } }: ProductDetailParams) {
  const response = await getProduct(id);
  return (
    <main className="flex flex-col items-center px-4">
      <div className="max-w-screen-sm lg:max-w-screen-2xl flex gap-x-36 w-full flex-col lg:flex-row">
        <ul className="flex flex-row lg:flex-col lg:flex-1 gap-4 lg:gap-52 items-center pt-16 lg:pt-60 overflow-x-scroll scrollbar-hide">
          {response.data!.productImages.map((value, index) => (
            <Image
              key={index}
              src={value}
              width={465}
              height={500}
              alt={"상품 이미지"}
              className="w-[90%] h-[150%] object-cover lg:w-fit "
            />
          ))}
        </ul>
        <section className="flex-1 flex flex-col lg:sticky lg:top-0 pt-16 lg:pt-60 h-fit">
          <h2 className="label-1 text-gray-800 mb-4">오아이</h2>
          <h1 className="display  text-gray-900 mb-3">
            {response.data!.title}
          </h1>
          <hr className="mb-12" />
          <div className="">
            <h3 className="heading-3 text-gray-800 mb-4">
              Product Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-6">
              <div className="flex flex-col gap-3">
                <p className="label-1  text-gray-800">Size</p>
                <p className="label-2  text-gray-800">{response.data!.size}</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="label-1  text-gray-800">Height</p>
                <p className="label-2  text-gray-800">
                  {response.data!.height}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="label-1  text-gray-800">Types</p>
                <p className="label-2  text-gray-800">
                  {response.data!.genderCategory}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="label-1  text-gray-800">Style</p>
                <ul className="flex gap-x-3 gap-y-2 flex-wrap">
                  {response.data!.styleCategory.map((value, index) => (
                    <li key={index} className="label-2  text-gray-800">
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button className="label-3 text-gray-400 mt-8">
              사이즈 가이드
            </button>
          </div>
          <Link href={`/messages`}>
            <button className="label-1 text-white mt-20 p-4 bg-primary rounded-full w-full lg:max-w-60">
              브랜드에게 연락하기
            </button>
          </Link>
        </section>
      </div>
    </main>
  );
}
