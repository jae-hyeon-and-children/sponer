export const PRODUCT_CATEGORIES = {
  상의: "상의",
  바지: "바지",
  아우터: "아우터",
  신발: "신발",
  원피스: "원피스",
  스커트: "스커트",
  모자: "모자",
  악세사리: "악세사리",
};
// 카테고리 불러올 때 몇몇 애들이 안불러와져서 한글로 수정하니 다 불러와짐 혹시 몰라 남겨둠
// tops: "상의",
// pants: "바지",
// outwear: "아우터",
// shoes: "신발",
// dresses: "원피스",
// skirts: "스커트",
// hats: "모자",
// accessories: "악세사리",

export const PRODUCT_CATEGORIES_REVERSE = Object.fromEntries(
  Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => [value, key])
);

export const PRODUCT_CATEGORIES_WITH_ALL = {
  all: "전체",
  ...PRODUCT_CATEGORIES,
};

export const PRODUCT_TYPES: Record<string, string> = {
  여자: "여자",
  남자: "남자",
  여남공용: "여남공용",
  키즈: "키즈",
};

export const PRODUCT_TYPES_WITH_ALL = {
  all: "전체",
  ...PRODUCT_TYPES,
};

export const PRODUCT_STYLES: Record<string, string> = {
  스트릿: "스트릿",
  정장: "정장",
  캐쥬얼: "캐쥬얼",
  스포츠: "스포츠",
  빈티지: "빈티지",
  댄디: "댄디",
  페미닌: "페미닌",
  베이직: "베이직",
  모던: "모던",
};

export const PRODUCT_SIZE: Record<string, string> = {
  xs: "XS",
  s: "S",
  m: "M",
  l: "L",
  xl: "XL",
};

export const PRODUCT_HEIGHT = {
  1: "150 ~ 155cm",
  2: "155 ~ 160cm",
  3: "160 ~ 165cm",
  4: "165 ~ 170cm",
  5: "170 ~ 175cm",
  6: "175 ~ 180cm",
};

export enum ContentType {
  text = "text",
  image = "image",
}

export enum UserType {
  stylist = "stylist",
  brand = "brand",
  admin = "admin",
}

export const PATH_ADD_USER = "add-user";
export const PATH_STYLIST_USER = "stylist-user";
export const PATH_BRAND_USER = "brand-user";

/**
 * Collection Name
 */

export const COLLECTION_NAME_CHAT = "Chat";
export const COLLECTION_NAME_MESSAGE = "Message";
export const COLLECTION_NAME_PRODUCT = "Product";
export const COLLECTION_NAME_USER = "User";

/**
 * Storage Reference Name
 */

export const STORAGE_REF_CHAT_IMAGES = "chat_images";
