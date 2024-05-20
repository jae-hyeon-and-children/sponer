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
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function getProducts(): Promise<IResponse<IProduct[]>> {
  try {
    const productsDocSnap = await getDocs(
      query(
        collection(fireStore, COLLECTION_NAME_PRODUCT),
        orderBy("createdAt", "desc")
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
