// import {
//   PRODUCT_SIZE,
//   PRODUCT_STYLES,
//   PRODUCT_TYPES,
// } from "@/constants/variables";
// import { getProduct } from "@/libs/api/product";
// import {
//   chatRoomProductState,
//   showDefaultModalState,
//   showProductSectionState,
// } from "@/recoil/atoms";
// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import Image from "next/image";
// import IcClose from "@/public/icons/ic_close.png";
// import IcArrowLeft from "@/public/icons/ic_arrow_left.png";
// import IcArrowRight from "@/public/icons/ic_arrow_right.png";
// import EmptyView from "../global/empty-view";
// import Modal from "../global/modal";
// import SizeTable from "../global/size-table";
// import { ISizeTable } from "@/constants/type-table";
// import { getSizeTable } from "@/libs/utils/table";

// export default function ProductsSection() {
//   const [loading, setLoading] = useState(true);
//   const chatRoomProduct = useRecoilValue(chatRoomProductState);
//   const imageListRef = useRef<HTMLUListElement>(null);
//   const [imageCurrIndex, setImageCurrIndex] = useState(1);
//   const [sizeTable, setSizeTable] = useState<ISizeTable | null>(null);
//   const [showProductSection, setShowProductSection] = useRecoilState(
//     showProductSectionState
//   );

//   useEffect(() => {
//     if (chatRoomProduct) {
//       setLoading(false);
//       setSizeTable(getSizeTable(chatRoomProduct.productCategory));
//       console.log("Gender Category:", chatRoomProduct.genderCategory);
//       console.log("Style Category:", chatRoomProduct.styleCategory);
//     }
//   }, [chatRoomProduct]);

//   const handlePrevClick = () => {
//     if (imageListRef.current && imageCurrIndex > 1) {
//       setImageCurrIndex(imageCurrIndex - 1);
//       scrollToImage(imageCurrIndex - 1);
//     }
//   };

//   const handleNextClick = () => {
//     if (
//       imageListRef.current &&
//       imageCurrIndex < chatRoomProduct!.productImages.length
//     ) {
//       setImageCurrIndex(imageCurrIndex + 1);
//       scrollToImage(imageCurrIndex + 1);
//     }
//   };

//   const scrollToImage = (index: number) => {
//     if (imageListRef.current) {
//       const child = imageListRef.current.children[index - 1] as HTMLElement;
//       if (child) {
//         const scrollPosition = child.offsetLeft;
//         imageListRef.current.scrollTo({
//           left: scrollPosition,
//           behavior: "smooth",
//         });
//       }
//     }
//   };

//   if (loading) {
//     return <div className={`${!showProductSection && "hidden"}`}>로딩 중</div>;
//   }

//   const handleCLose = () => setShowProductSection(false);

//   return (
//     <section
//       className={`fixed top-0 right-0 transition-transform duration-300 ease-in-out transform ${
//         showProductSection ? "translate-x-0" : "translate-x-full"
//       } overflow-y-scroll scrollbar-hide w-96  h-screen bg-white border-l border-l-gray-100`}
//     >
//       <Modal>
//         {sizeTable && (
//           <SizeTable
//             tableHeader={sizeTable!.header}
//             tableBody={sizeTable!.body}
//           />
//         )}
//       </Modal>
//       <div className="px-6 py-5 mt-[4.5rem] flex items-center justify-between">
//         <h1 className="label-1 text-gray-600">상품 정보</h1>
//         <button onClick={handleCLose}>
//           <Image src={IcClose} alt="IcClose" width={20} height={20} />
//         </button>
//       </div>
//       {!chatRoomProduct ? (
//         <EmptyView text="해당 상품이 존재하지 않습니다" />
//       ) : (
//         <>
//           <section className="relative flex items-center justify-center">
//             <ul
//               ref={imageListRef}
//               className="scrollbar-hide h-96 flex flex-row gap-4 items-center overflow-x-scroll overflow-y-hidden snap-x snap-mandatory"
//             >
//               {chatRoomProduct.productImages.map((value, index) => (
//                 <Image
//                   key={index}
//                   src={value}
//                   width={465}
//                   height={500}
//                   alt={"상품 이미지"}
//                   className="w-full object-cover snap-center"
//                 />
//               ))}
//             </ul>
//             {chatRoomProduct!.productImages.length > 1 && (
//               <>
//                 <div className="flex justify-between absolute w-full px-2">
//                   <button
//                     onClick={handlePrevClick}
//                     className="shrink-0 w-9 h-9 bg-white backdrop-blur-sm rounded-full flex justify-center items-center"
//                   >
//                     <Image
//                       src={IcArrowLeft}
//                       alt="IcArrowLeft"
//                       width={20}
//                       height={20}
//                     />
//                   </button>
//                   <button
//                     onClick={handleNextClick}
//                     className="shrink-0 w-9 h-9 bg-white backdrop-blur-sm rounded-full flex justify-center items-center"
//                   >
//                     <Image
//                       src={IcArrowRight}
//                       alt="IcArrowRight"
//                       width={20}
//                       height={20}
//                     />
//                   </button>
//                 </div>
//                 <div
//                   className={`gap-1.5 absolute bottom-0 mb-5 rounded-full flex items-center`}
//                 >
//                   {Array.from({
//                     length: chatRoomProduct!.productImages.length,
//                   }).map((_, index) => (
//                     <button
//                       onClick={() => {
//                         setImageCurrIndex(index + 1);
//                         scrollToImage(index + 1);
//                       }}
//                       key={index}
//                       className={`${
//                         imageCurrIndex === index + 1 ? "w-4 h-1.5" : "w-2 h-2"
//                       }  ${
//                         imageCurrIndex === index + 1
//                           ? "bg-white"
//                           : "bg-gray-900/50"
//                       } rounded-full backdrop-blur-sm`}
//                     ></button>
//                   ))}
//                 </div>
//               </>
//             )}
//           </section>
//           <section className="flex flex-col pt-6 w-full px-6 pb-12">
//             <h1 className="display text-gray-900 mb-3">
//               {chatRoomProduct.title}
//             </h1>
//             <hr className="mb-6" />
//             <div className="">
//               <h3 className="heading-3 text-gray-800 mb-4">상품 정보</h3>
//               <div className="grid grid-cols-1 gap-x-2 gap-y-6">
//                 <div className="flex flex-col gap-3">
//                   <h4 className="label-1  text-gray-800">Size</h4>
//                   <p className="label-2  text-gray-800">
//                     {PRODUCT_SIZE[chatRoomProduct.size]}
//                   </p>
//                 </div>
//                 <div className="flex flex-col gap-3">
//                   <h4 className="label-1  text-gray-800">Height</h4>
//                   <p className="label-2  text-gray-800">
//                     {chatRoomProduct.height}
//                   </p>
//                 </div>
//                 <div className="flex flex-col gap-3">
//                   <h4 className="label-1  text-gray-800">Types</h4>
//                   <p className="label-2  text-gray-800">
//                     {PRODUCT_TYPES[chatRoomProduct.genderCategory] || "테스트"}
//                   </p>
//                 </div>
//                 <div className="flex flex-col gap-3">
//                   <h4 className="label-1  text-gray-800">Style</h4>
//                   <ul className="flex gap-x-3 gap-y-2 flex-wrap">
//                     {chatRoomProduct.styleCategory.map((value, index) => (
//                       <li key={index} className="label-2  text-gray-800">
//                         {PRODUCT_STYLES[value] || "테스트"}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </>
//       )}
//     </section>
//   );
// }

import {
  PRODUCT_SIZE,
  PRODUCT_STYLES,
  PRODUCT_TYPES,
  PRODUCT_CATEGORIES, // Import PRODUCT_CATEGORIES for product types
} from "@/constants/variables";
import { chatRoomProductState, showProductSectionState } from "@/recoil/atoms";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Image from "next/image";
import IcClose from "@/public/icons/ic_close.png";
import IcArrowLeft from "@/public/icons/ic_arrow_left.png";
import IcArrowRight from "@/public/icons/ic_arrow_right.png";
import EmptyView from "../global/empty-view";
import Modal from "../global/modal";
import SizeTable from "../global/size-table";
import { ISizeTable } from "@/constants/type-table";
import { getSizeTable } from "@/libs/utils/table";

export default function ProductsSection() {
  const [loading, setLoading] = useState(true);
  const chatRoomProduct = useRecoilValue(chatRoomProductState);
  const imageListRef = useRef<HTMLUListElement>(null);
  const [imageCurrIndex, setImageCurrIndex] = useState(1);
  const [sizeTable, setSizeTable] = useState<ISizeTable | null>(null);
  const [showProductSection, setShowProductSection] = useRecoilState(
    showProductSectionState
  );

  useEffect(() => {
    if (chatRoomProduct) {
      setLoading(false);
      setSizeTable(getSizeTable(chatRoomProduct.productCategory));
      console.log("Gender Category:", chatRoomProduct.genderCategory);
      console.log("Style Category:", chatRoomProduct.styleCategory);
    }
  }, [chatRoomProduct]);

  const handlePrevClick = () => {
    if (imageListRef.current && imageCurrIndex > 1) {
      setImageCurrIndex(imageCurrIndex - 1);
      scrollToImage(imageCurrIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (
      imageListRef.current &&
      imageCurrIndex < chatRoomProduct!.productImages.length
    ) {
      setImageCurrIndex(imageCurrIndex + 1);
      scrollToImage(imageCurrIndex + 1);
    }
  };

  const scrollToImage = (index: number) => {
    if (imageListRef.current) {
      const child = imageListRef.current.children[index - 1] as HTMLElement;
      if (child) {
        const scrollPosition = child.offsetLeft;
        imageListRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  };

  if (loading) {
    return <div className={`${!showProductSection && "hidden"}`}>로딩 중</div>;
  }

  const handleCLose = () => setShowProductSection(false);

  return (
    <section
      className={`fixed top-0 right-0 transition-transform duration-300 ease-in-out transform ${
        showProductSection ? "translate-x-0" : "translate-x-full"
      } overflow-y-scroll scrollbar-hide w-96  h-screen bg-white border-l border-l-gray-100`}
    >
      <Modal>
        {sizeTable && (
          <SizeTable
            tableHeader={sizeTable!.header}
            tableBody={sizeTable!.body}
          />
        )}
      </Modal>
      <div className="px-6 py-5 mt-[4.5rem] flex items-center justify-between">
        <h1 className="label-1 text-gray-600">상품 정보</h1>
        <button onClick={handleCLose}>
          <Image src={IcClose} alt="IcClose" width={20} height={20} />
        </button>
      </div>
      {!chatRoomProduct ? (
        <EmptyView text="해당 상품이 존재하지 않습니다" />
      ) : (
        <>
          <section className="relative flex items-center justify-center">
            <ul
              ref={imageListRef}
              className="scrollbar-hide h-96 flex flex-row gap-4 items-center overflow-x-scroll overflow-y-hidden snap-x snap-mandatory"
            >
              {chatRoomProduct.productImages.map((value, index) => (
                <Image
                  key={index}
                  src={value}
                  width={465}
                  height={500}
                  alt={"상품 이미지"}
                  className="w-full object-cover snap-center"
                />
              ))}
            </ul>
            {chatRoomProduct!.productImages.length > 1 && (
              <>
                <div className="flex justify-between absolute w-full px-2">
                  <button
                    onClick={handlePrevClick}
                    className="shrink-0 w-9 h-9 bg-white backdrop-blur-sm rounded-full flex justify-center items-center"
                  >
                    <Image
                      src={IcArrowLeft}
                      alt="IcArrowLeft"
                      width={20}
                      height={20}
                    />
                  </button>
                  <button
                    onClick={handleNextClick}
                    className="shrink-0 w-9 h-9 bg-white backdrop-blur-sm rounded-full flex justify-center items-center"
                  >
                    <Image
                      src={IcArrowRight}
                      alt="IcArrowRight"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
                <div
                  className={`gap-1.5 absolute bottom-0 mb-5 rounded-full flex items-center`}
                >
                  {Array.from({
                    length: chatRoomProduct!.productImages.length,
                  }).map((_, index) => (
                    <button
                      onClick={() => {
                        setImageCurrIndex(index + 1);
                        scrollToImage(index + 1);
                      }}
                      key={index}
                      className={`${
                        imageCurrIndex === index + 1 ? "w-4 h-1.5" : "w-2 h-2"
                      }  ${
                        imageCurrIndex === index + 1
                          ? "bg-white"
                          : "bg-gray-900/50"
                      } rounded-full backdrop-blur-sm`}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </section>
          <section className="flex flex-col pt-6 w-full px-6 pb-12">
            <h1 className="display text-gray-900 mb-3">
              {chatRoomProduct.title}
            </h1>
            <hr className="mb-6" />
            <div className="">
              <h3 className="heading-3 text-gray-800 mb-4">상품 정보</h3>
              <div className="grid grid-cols-1 gap-x-2 gap-y-6">
                <div className="flex flex-col gap-3">
                  <h4 className="label-1  text-gray-800">Size</h4>
                  <p className="label-2  text-gray-800">
                    {PRODUCT_SIZE[chatRoomProduct.size]}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="label-1  text-gray-800">Height</h4>
                  <p className="label-2  text-gray-800">
                    {chatRoomProduct.height}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="label-1  text-gray-800">Types</h4>
                  <p className="label-2  text-gray-800">
                    {PRODUCT_TYPES[chatRoomProduct.genderCategory] || "테스트"}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="label-1  text-gray-800">Style</h4>
                  <ul className="flex gap-x-3 gap-y-2 flex-wrap">
                    {chatRoomProduct.styleCategory.map((value, index) => (
                      <li key={index} className="label-2  text-gray-800">
                        {PRODUCT_STYLES[value] || "테스트"}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="label-1  text-gray-800">Category</h4>
                  <p className="label-2  text-gray-800">
                    {PRODUCT_CATEGORIES[
                      chatRoomProduct.productCategory as keyof typeof PRODUCT_CATEGORIES
                    ] || "테스트"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
