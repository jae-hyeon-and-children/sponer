import { fireStore } from "@/config/firebase/firebase";
import { COLLECTION_NAME_USER } from "@/constants/variables";
import { UserConverter } from "@/model/user";
import { IResponse } from "@/model/responses";
import { IUser } from "@/model/user";
import { collection, doc, getDoc, orderBy, query } from "firebase/firestore";

export async function getUser(id: string): Promise<IResponse<IUser>> {
  try {
    const userDocSnap = await getDoc(doc(fireStore, COLLECTION_NAME_USER, id));
    if (!userDocSnap.exists()) {
      return {
        status: 404,
        success: false,
        message: `User with id ${id} not found.`,
      };
    }

    const user = UserConverter.fromFirestore(userDocSnap);

    return { status: 200, success: true, data: user };
  } catch (error) {
    return {
      status: 400,
      success: false,
      message: `Error white fetching user with id ${id}: ${error}`,
    };
  }
}
