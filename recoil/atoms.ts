import { PRODUCT_TYPES_WITH_ALL } from "@/constants/variables";
import { IChatUser } from "@/model/chat-room";
import { IProduct } from "@/model/product";
import { atom } from "recoil";

export const showDefaultModalState = atom<boolean>({
  key: "showDefaultModalState",
  default: false,
});

export const showChatRoomListState = atom<boolean>({
  key: "showChatRoomListState",
  default: false,
});

export const showProductSectionState = atom<boolean>({
  key: "showProductSectionState",
  default: false,
});

export const chatRoomIdState = atom<string | null>({
  key: "chatRoomIdState",
  default: null,
});

export const chatRoomUserState = atom<IChatUser | null>({
  key: "chatRoomUserState",
  default: null,
});

export const chatRoomProductState = atom<IProduct | null>({
  key: "chatRoomProductState",
  default: null,
});
