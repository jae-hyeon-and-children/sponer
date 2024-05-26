import { fireStore } from "@/config/firebase/firebase";
import { COLLECTION_NAME_PRODUCT } from "@/constants/variables";
import { IProduct, ProductConverter } from "@/model/product";
import { IResponse } from "@/model/responses";
import { collection, doc, getDoc, orderBy, query } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function getProduct(id: string): Promise<IResponse<IProduct>> {
  try {
    const productDocSnap = await getDoc(
      doc(fireStore, COLLECTION_NAME_PRODUCT, id)
    );

    if (!productDocSnap.exists()) {
      return {
        status: 404,
        success: false,
        message: `Product with id ${id} not found.`,
      };
    }

    const post = ProductConverter.fromFirestore(productDocSnap);

    return { status: 200, success: true, data: post };
  } catch (error) {
    return {
      status: 400,
      success: false,
      message: `Error white fetching product id ${id}: ${error}`,
    };
  }
}
