import { fireStore } from "@/config/firebase/firebase";
import {
  COLLECTION_NAME_CHAT,
  COLLECTION_NAME_MESSAGE,
} from "@/constants/variables";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";

export async function deleteChatRoom(chatRoomId: string) {
  try {
    const chatRoomRef = doc(fireStore, COLLECTION_NAME_CHAT, chatRoomId);

    // Delete all messages in the chat room
    const messagesSnapshot = await getDocs(
      collection(chatRoomRef, COLLECTION_NAME_MESSAGE)
    );
    const batch = writeBatch(fireStore);
    messagesSnapshot.forEach((messageDoc) => {
      batch.delete(messageDoc.ref);
    });
    await batch.commit();

    // Delete the chat room
    await deleteDoc(chatRoomRef);

    return {
      status: 200,
      success: true,
    };
  } catch (error) {
    console.error("Error deleting chat room: ", error);
    return {
      status: 400,
      success: false,
      message: `Error deleting chat room: ${error}`,
    };
  }
}
