import { atom } from "recoil";
import { IChatUser } from "@/model/chat-room";
import { IProduct } from "@/model/product";

export const showDefaultModalState = atom<boolean>({
  key: "showDefaultModalState",
  default: false,
});

export const modalMessageState = atom<string>({
  key: "modalMessageState",
  default: "",
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

export type ToastType = "success" | "error";

export interface ToastMessage {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

export const toastState = atom<ToastMessage>({
  key: "toastState",
  default: {
    isVisible: false,
    message: "",
    type: "success",
  },
});

export const unreadCountState = atom<{ [key: string]: number }>({
  key: "unreadCountState",
  default: {},
});

export const showCustomModalState = atom<boolean>({
  key: "showCustomModalState",
  default: false,
});

// export const customModalMessageState = atom<string>({
//   key: "customModalMessageState",
//   default: "",
// });
