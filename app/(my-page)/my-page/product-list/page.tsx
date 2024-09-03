"use client";

import { useEffect, useState } from "react";
import { ProductSideBar } from "@/components/my-page/side-bar";
import { getProduct } from "./actions";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/model/product";
import EmptyView from "@/components/global/empty-view";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/constants/variables";
import { getUserById } from "../[id]/actions";

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
  const [userApproved, setUserApproved] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        router.push("login");
        return;
      }

      if (session?.user?.id) {
        try {
          const userType = session.user.userType;
          const userBrandId = session.user.uid;

          if (
            userType === "stylist" ||
            (userType !== "admin" && userBrandId !== session.user.uid)
          ) {
            router.push("/");
            return;
          }

          console.log("Fetching user data...");
          const userData = await getUserById(session.user.id);
          console.log("Fetched user data:", userData);

          if (userData) {
            console.log("User approve status:", userData.approve);
            setUserApproved(userData.approve || false);
            console.log("Updated userApproved state:", userApproved);
          }

          const result = await getProduct(session.user.id);
          setProducts(result);
        } catch (error) {
          console.error("Error fetching products or user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session, router]);

  console.log("Final userApproved state:", userApproved);

  if (loading) {
    return (
      <main className="w-full h-screen flex bg-gray-100">
        <ProductSideBar />
        <div className="w-full mt-8">
          <div className="w-full h-52 bg-primary px-4 md:px-28">
            <div className="w-full flex flex-col md:flex-row items-center justify-between pt-28 max-w-screen-xl mx-auto md:pt-24">
              <div className="display text-gray-100 mb-2 md:mb-0">
                상품 관리
              </div>
              <div className="flex flex-col items-center md:items-end mt-2 md:mt-0">
                <Link href={"/my-page/product"}>
                  <button
                    className={`label-1 text-primary bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition ${
                      userApproved ? "" : "cursor-not-allowed opacity-50"
                    }`}
                    disabled={!userApproved}
                  >
                    새로운 상품 등록하기
                  </button>
                </Link>
                {!userApproved && (
                  <span className="text-xs text-red-500 mt-2 text-center">
                    브랜드 승인이 되어야 상품 등록을 할 수 있으며, 승인에는
                    2-3일 소요될 수 있습니다.
                  </span>
                )}
              </div>
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
        <div className="w-full mt-8">
          <div className="w-full h-52 bg-primary px-4 md:px-28">
            <div className="w-full flex flex-col md:flex-row items-center justify-between pt-28 max-w-screen-xl mx-auto md:pt-24">
              <div className="display text-gray-100 mb-2 md:mb-0">
                상품 관리
              </div>
              <div className="flex flex-col items-center md:items-end mt-2 md:mt-0">
                <Link href={"/my-page/product"}>
                  <button
                    className={`label-1 text-primary bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition ${
                      userApproved ? "" : "cursor-not-allowed opacity-50"
                    }`}
                    disabled={!userApproved}
                  >
                    새로운 상품 등록하기
                  </button>
                </Link>
                {!userApproved && (
                  <span className="text-xs text-red-500 mt-2 text-center">
                    브랜드 승인이 되어야 상품 등록을 할 수 있으며, 승인에는
                    2-3일 소요될 수 있습니다.
                  </span>
                )}
              </div>
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
      <div className="w-full mt-8">
        <div className="w-full h-52 bg-primary px-4 md:px-28">
          <div className="w-full flex flex-col md:flex-row items-center justify-between pt-28 max-w-screen-xl mx-auto md:pt-24">
            <div className="display text-gray-100">상품 관리</div>
            <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
              <Link href={"/my-page/product"}>
                <button
                  className={`label-1 text-primary bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition ${
                    userApproved ? "" : "cursor-not-allowed opacity-50"
                  }`}
                  disabled={!userApproved}
                >
                  새로운 상품 등록하기
                </button>
              </Link>
              {!userApproved && (
                <span className="text-xs text-red-500 mt-1 text-center md:text-right">
                  브랜드 승인이 되어야 상품 등록을 할 수 있으며, 승인에는 2-3일
                  소요될 수 있습니다.
                </span>
              )}
            </div>
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
