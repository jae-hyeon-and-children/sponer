import { fireStore } from "@/config/firebase/firebase";
import { COLLECTION_NAME_USER } from "@/constants/variables";
import { UserConverter } from "@/model/user";
import { IResponse } from "@/model/responses";
import { IUser } from "@/model/user";
import { collection, doc, getDoc, orderBy, query } from "firebase/firestore";

export async function getBrand(id: string): Promise<IResponse<IUser>> {
  try {
    const brandDocSnap = await getDoc(doc(fireStore, COLLECTION_NAME_USER, id));

    if (!brandDocSnap.exists()) {
      return {
        status: 404,
        success: false,
        message: `Brand with id ${id} not found.`,
      };
    }

    const brand = UserConverter.fromFirestore(brandDocSnap);

    return { status: 200, success: true, data: brand };
  } catch (error) {
    return {
      status: 400,
      success: false,
      message: `Error white fetching brand with id ${id}: ${error}`,
    };
  }
}
