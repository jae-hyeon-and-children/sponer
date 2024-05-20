import Image from "next/image";
import Link from "next/link";

export default function Product() {
  return (
    <main className="flex flex-col items-center px-4">
      <div className="max-w-screen-2xl flex gap-x-36">
        <section className="flex flex-col gap-52 items-center pt-60">
          <Image
            src={
              "https://flexible.img.hani.co.kr/flexible/normal/700/1040/imgdb/original/2021/0428/20210428504000.jpg"
            }
            width={465}
            height={500}
            alt={"상품 이미지"}
            className="snap-start"
          />
          <Image
            src={
              "https://flexible.img.hani.co.kr/flexible/normal/700/1040/imgdb/original/2021/0428/20210428504000.jpg"
            }
            width={465}
            height={500}
            alt={"상품 이미지"}
            className="snap-center"
          />
          <Image
            src={
              "https://flexible.img.hani.co.kr/flexible/normal/700/1040/imgdb/original/2021/0428/20210428504000.jpg"
            }
            width={465}
            height={500}
            alt={"상품 이미지"}
            className="snap-center"
          />
        </section>
        <section className="flex flex-col sticky top-0 pt-60 h-fit ">
          <h2 className="label-1 text-gray-800 mb-4">오와이</h2>
          <h1 className="display  text-gray-900 mb-3">
            와이셔츠 로렌 섬머 슬랙스 롤업
          </h1>
          <hr className="mb-12" />
          <div className="">
            <h3 className="heading-3 text-gray-800 mb-4">
              Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-6">
              <div className="flex flex-col gap-3">
                <p className="label-1  text-gray-800">Size</p>
                <p className="label-2  text-gray-800">M</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="label-1  text-gray-800">Height</p>
                <p className="label-2  text-gray-800">170 ~ 175cm</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="label-1  text-gray-800">Types</p>
                <p className="label-2  text-gray-800">남자</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="label-1  text-gray-800">Style</p>
                <ul className="flex gap-3">
                  <li className="label-2  text-gray-800">M</li>
                  <li className="label-2  text-gray-800">M</li>
                </ul>
              </div>
            </div>
            <button className="label-3 text-gray-400 mt-8">
              사이즈 가이드
            </button>
          </div>
          <Link href={`/messages`}>
            <button className="label-1 text-gray-400 mt-20">
              브랜드에게 연락하기
            </button>
          </Link>
        </section>
      </div>
    </main>
  );
}
