// "use client";

// import { ProductSideBar } from "@/components/my-page/side-bar";
// import { getProduct } from "./actions";
// import Image from "next/image";
// import Link from "next/link";
// import { IProduct } from "@/model/product";
// import { useEffect, useState } from "react";
// import EmptyView from "@/components/global/empty-view";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// const SkeletonProduct = () => (
//   <div className="animate-pulse h-fit">
//     <div className="bg-slate-200 h-64 w-full mb-4 rounded-md"></div>
//     <div className="bg-slate-200 h-6 w-3/4 mb-2 rounded-md"></div>
//     <div className="bg-slate-200 h-4 w-1/2 mb-2 rounded-md"></div>
//     <div className="bg-slate-200 h-4 w-1/3 rounded-md"></div>
//   </div>
// );

// export default function ProductList() {
//   const [products, setProducts] = useState<IProduct[] | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!session) {
//         router.push("login");
//         return;
//       }

//       if (session && session?.user?.id) {
//         const userType = session.user.userType;
//         const userBrandId = session.user.uid;

//         if (
//           userType === "stylist" ||
//           (userType !== "admin" && userBrandId !== session.user.uid)
//         ) {
//           router.push("/");
//           return;
//         }

//         try {
//           const result = await getProduct(session?.user?.id);
//           setProducts(result);
//           setLoading(false);
//           console.log(result);
//         } catch (error) {
//           console.error("Error fetching products:", error);
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();
//   }, [session]);

//   if (loading) {
//     console.log("Loading");

//     return (
//       <main className="w-full h-screen flex">
//         <ProductSideBar />
//         <div className="w-full mt-8">
//           <div className="w-full h-52 bg-primary px-4 md:px-36">
//             <div className="w-full flex justify-between pt-36 max-w-screen-xl">
//               <div className="display text-gray-100">상품 관리</div>
//               <Link href={"/my-page/product"}>
//                 <button className="label-1 text-primary bg-white py-2 px-4 rounded-3xl">
//                   새로운 상품 등록하기
//                 </button>
//               </Link>
//             </div>
//           </div>
//           <div className="grid grid-cols-3 md:grid-cols-4 w-full max-w-screen-xl gap-6 px-4 md:pl-36 mt-20">
//             {Array.from({ length: 8 }).map((_, index) => (
//               <div key={index} className="h-fit w-full">
//                 <SkeletonProduct />
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (!products || products.length === 0) {
//     return (
//       <main className="w-full h-screen flex">
//         <ProductSideBar />
//         <div className="w-full mt-20">
//           <div className="w-full h-52 bg-primary px-4 md:px-36">
//             <div className="w-full flex justify-between pt-36 max-w-screen-xl">
//               <div className="display text-gray-100">상품 관리</div>
//               <Link href={"/my-page/product"}>
//                 <button className="label-1 text-primary bg-white py-2 px-4 rounded-3xl">
//                   새로운 상품 등록하기
//                 </button>
//               </Link>
//             </div>
//           </div>
//           <div className="px-4 md:pl-36 mt-20">
//             <EmptyView text="상품이 존재하지 않습니다." />
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="w-full  flex">
//       <ProductSideBar />
//       <div className="w-full mt-20">
//         <div className="w-full h-52 bg-primary px-4 md:px-36">
//           <div className="w-full flex justify-between pt-36 max-w-screen-xl">
//             <div className="display text-gray-100">상품 관리</div>
//             <Link href={"/my-page/product"}>
//               <button className="label-1 text-primary bg-white py-2 px-4 rounded-3xl">
//                 새로운 상품 등록하기
//               </button>
//             </Link>
//           </div>
//         </div>
//         <div className="grid grid-cols-3 md:grid-cols-4 w-full max-w-screen-xl gap-6 px-4 md:pl-36 mt-20">
//           {products.map((product) => (
//             <Link
//               href={`/my-page/product/${product.id}`}
//               className="h-fit"
//               key={product.id}
//             >
//               <Image
//                 src={product.productImages[0]}
//                 width={1000}
//                 height={260}
//                 quality={50}
//                 priority
//                 alt={product.title}
//                 className="object-cover h-[260px]"
//                 style={{ objectFit: "cover" }}
//               />
//               <div className="pt-5 h-fit w-full flex flex-col">
//                 <span className="heading-2 text-gray-700 pb-3">
//                   {product.title.length > 17
//                     ? product.title.substring(0, 17) + "..."
//                     : product.title}
//                 </span>
//                 <span className="caption-1 text-gray-500 pb-1.5">
//                   {`${product.size.toUpperCase()} / ${product.height} / ${
//                     product.genderCategory
//                   }`}
//                 </span>
//                 <span className="caption-1 text-gray-500 w-full flex gap-x-2 gap-y-1 flex-wrap">
//                   {product.styleCategory.map((style: string) => (
//                     <span key={style}>{style}</span>
//                   ))}
//                 </span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { ProductSideBar } from "@/components/my-page/side-bar";
import { getProduct } from "./actions";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/model/product";
import { useEffect, useState } from "react";
import EmptyView from "@/components/global/empty-view";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/constants/variables";

const SkeletonProduct = () => (
  <div className="animate-pulse h-fit">
    <div className="bg-slate-200 h-64 w-full mb-4 rounded-md"></div>
    <div className="bg-slate-200 h-6 w-3/4 mb-2 rounded-md"></div>
    <div className="bg-slate-200 h-4 w-1/2 mb-2 rounded-md"></div>
    <div className="bg-slate-200 h-4 w-1/3 rounded-md"></div>
  </div>
);

export default function ProductList() {
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        router.push("login");
        return;
      }

      if (session && session?.user?.id) {
        const userType = session.user.userType;
        const userBrandId = session.user.uid;

        if (
          userType === "stylist" ||
          (userType !== "admin" && userBrandId !== session.user.uid)
        ) {
          router.push("/");
          return;
        }

        try {
          const result = await getProduct(session?.user?.id);
          setProducts(result);
          setLoading(false);
          console.log(result);
        } catch (error) {
          console.error("Error fetching products:", error);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);

  if (loading) {
    console.log("Loading");

    return (
      <main className="w-full h-screen flex bg-gray-100">
        <ProductSideBar />
        <div className="w-full mt-8">
          <div className="w-full h-52 bg-primary px-4 md:px-28">
            <div className="w-full flex justify-between pt-36 max-w-screen-xl mx-auto">
              <div className="display text-gray-100">상품 관리</div>
              <Link href={"/my-page/product"}>
                <button className="label-1 text-primary bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                  새로운 상품 등록하기
                </button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-screen-xl mx-auto px-4 mt-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-fit w-full">
                <SkeletonProduct />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!products || products.length === 0) {
    return (
      <main className="w-full h-screen flex bg-gray-100">
        <ProductSideBar />
        <div className="w-full mt-20">
          <div className="w-full h-52 bg-primary px-4 md:px-28">
            <div className="w-full flex justify-between pt-36 max-w-screen-xl mx-auto">
              <div className="display text-gray-100">상품 관리</div>
              <Link href={"/my-page/product"}>
                <button className="label-1 text-primary bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                  새로운 상품 등록하기
                </button>
              </Link>
            </div>
          </div>
          <div className="px-4 md:px-28 mt-20 max-w-screen-xl mx-auto">
            <EmptyView text="상품이 존재하지 않습니다." />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex bg-gray-100">
      <ProductSideBar />
      <div className="w-full mt-20">
        <div className="w-full h-52 bg-primary px-4 md:px-28">
          <div className="w-full flex justify-between pt-36 max-w-screen-xl mx-auto">
            <div className="display text-gray-100">상품 관리</div>
            <Link href={"/my-page/product"}>
              <button className="label-1 text-primary bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                새로운 상품 등록하기
              </button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-screen-xl mx-auto px-4 mt-12">
          {products.map((product) => (
            <Link
              href={`/my-page/product/${product.id}`}
              className="h-fit bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
              key={product.id}
            >
              <div className="flex-grow flex items-center justify-center">
                <Image
                  src={product.productImages[0]}
                  width={1000}
                  height={150}
                  quality={50}
                  priority
                  alt={product.title}
                  className="object-cover h-[200px] w-full"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4 flex flex-col justify-center items-start">
                <span className="block heading-2 text-gray-700 pb-3 truncate text-center w-full">
                  {product.title}
                </span>
                <span className="caption-1 text-gray-500 pb-1.5 block text-center w-full">
                  {`${product.size.toUpperCase()} / ${product.height} / ${
                    product.genderCategory
                  }`}
                </span>
                <span className="caption-1 text-gray-500 w-full flex gap-x-2 gap-y-1 flex-wrap justify-center">
                  {product.styleCategory.map((style: string) => (
                    <span
                      key={style}
                      className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                    >
                      {style}
                    </span>
                  ))}
                </span>

                <span className="caption-1 text-gray-500 pt-2 block text-center w-full">
                  {PRODUCT_CATEGORIES[
                    product.productCategory as keyof typeof PRODUCT_CATEGORIES
                  ] || "카테고리 없음"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
