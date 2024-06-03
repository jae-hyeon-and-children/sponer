import { fireStore } from "@/config/firebase/firebase";
import { COLLECTION_NAME_PRODUCT } from "@/constants/variables";

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
  category: string,
  type?: string,
  style?: string[],
  keyword?: string
): Promise<IResponse<IProduct[]>> {
  const queries = [];
  if (category !== "all")
    queries.push(where("productCategory", "==", category));
  if (type && type !== "all") queries.push(where("genderCategory", "==", type));
  if (style && style.length > 0)
    queries.push(where("styleCategory", "array-contains-any", style));

  console.log(category, type, style, keyword);
  console.log(queries);
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
      console.log(convertedProduct);
    }

    return { status: 200, success: true, data: products };
  } catch (error) {
    return {
      status: 400,
      success: false,
      message: `Error white fetching products: ${error}`,
    };
  }
}
