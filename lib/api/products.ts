import { fireStore } from "@/config/firebase/firebase";

import {
  COLLECTION_NAME_PRODUCT,
  PRODUCT_CATEGORIES_WITH_ALL,
} from "@/constants/variables";

import { IProduct, ProductConverter } from "@/model/product";
import { IResponse } from "@/model/responses";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function getProducts(
  category: string
): Promise<IResponse<IProduct[]>> {
  // 카테고리 및 필터링에 맞는 쿼리 담기
  const queries = [];

  if (category !== "all")
    queries.push(where("productCategory", "==", category));

  try {
    const productsDocSnap = await getDocs(
      query(
        collection(fireStore, COLLECTION_NAME_PRODUCT),
        orderBy("createdAt", "desc"),
        ...queries
      )
    );

    const products = [];

    for (const product of productsDocSnap.docs) {
      const convertedProduct = ProductConverter.fromFirestore(product);
      products.push(convertedProduct);
    }

    return { status: 200, success: true, data: products };
  } catch (error) {
    return {
      status: 200,
      success: false,
      message: `Error white fetching products: ${error}`,
    };
  }
}
