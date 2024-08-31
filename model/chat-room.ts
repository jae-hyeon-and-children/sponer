import { DocumentSnapshot, Timestamp } from "firebase/firestore";

export interface IChatUser {
  id: string;
  name: string;
  nickName?: string;
  brandName?: string;

  profileImage: string;
}

export interface IChatRoom {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessage: string;
  users: [IChatUser, IChatUser];
  userIds: [string, string];
  productId?: string;
}

export const ChatRoomConverter = {
  fromFirestore: (chatRoom: DocumentSnapshot): IChatRoom => {
    const id = chatRoom.id;
    const data = chatRoom.data();
    return {
      id,
      lastMessage: data?.lastMessage,
      users: data?.users,
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
      userIds: data?.userIds,
      productId: data?.productId,
    };
  },
};
