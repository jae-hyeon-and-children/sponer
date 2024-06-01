import { PRODUCT_TYPES_WITH_ALL } from "@/constants/variables";
import { IChatUser } from "@/model/chat-room";
import { IProduct } from "@/model/product";
import { atom } from "recoil";

export const typeFilterCategoryState = atom<string>({
  key: "typeFilterCategoryState",
  default: "all",
});

export const styleFilterCategoryState = atom<string[]>({
  key: "styleFilterCategoryState",
  default: [],
});

export const showFilterModalState = atom<boolean>({
  key: "showFilterModalState",
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

export const showProductsState = atom<boolean>({
  key: "showProductsState",
  default: false,
});
