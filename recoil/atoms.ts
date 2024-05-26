import { IChatRoom } from "@/model/chat-room";
import { atom } from "recoil";

export const chatRoomIdState = atom<string | null>({
  key: "chatRoomIdState",
  default: null,
});

export const chatRoomState = atom<IChatRoom | null>({
  key: "chatRoomState",
  default: null,
});

export const showProductsState = atom<boolean>({
  key: "showProductsState",
  default: false,
});
