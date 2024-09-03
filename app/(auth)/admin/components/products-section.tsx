"use client";

import { fireStore } from "@/config/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import Link from "next/link";

// 제품 타입 정의
type Product = {
  id: string;
  title: string;
  brandName: string;
  productCategory: string;
  styleCategory: string[];
  genderCategory: string;
  size: string;
  description?: string;
  link: string;
};

// 모든 제품을 가져오는 함수
async function fetchAllProducts(): Promise<Product[]> {
  const productsCollection = collection(fireStore, "Product");
  const productsSnapshot = await getDocs(productsCollection);
  const productsList = productsSnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Product, "link">;
    return {
      ...data,
      id: doc.id,
      link: `/product/${doc.id}`,
    };
  });
  return productsList;
}

// 제품 목록을 표시하는 컴포넌트
export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts: Product[] = await fetchAllProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    };

    getProducts();
  }, []);

  if (loading) {
    return <div className="text-center">제품 목록을 불러오는 중...</div>;
  }

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">제품 목록</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 ease-in-out"
          >
            <Link href={product.link} className="block">
              <div className="flex flex-col">
                <p className="text-lg font-bold">{product.title}</p>
                <p className="text-sm text-gray-600">
                  <strong>브랜드명:</strong> {product.brandName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>카테고리:</strong> {product.productCategory}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>스타일:</strong> {product.styleCategory.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>성별:</strong> {product.genderCategory}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>사이즈:</strong> {product.size}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>UID:</strong> {product.id}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
// 제품사진까지 가지고 올려면 추가 가능
{
  /* <div className="w-1/2 flex justify-center items-center">
{product.productImages && product.productImages.length > 0 && (
  <Image
    src={product.productImages[0]}
    alt={product.title}
    width={200}
    height={200}
    className="object-cover rounded-lg"
  />
)}
</div> */
}
