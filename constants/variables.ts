export const PRODUCT_CATEGORIES = {
	tops: "상의",
	pants: "바지",
	outwear: "아우터",
	shoes: "신발",
	dresses: "원피스",
	skirts: "스커트",
	hats: "모자",
	accessories: "악세사리",
};

export const PRODUCT_CATEGORIES_REVERSE = Object.fromEntries(
	Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => [value, key])
);

export const PRODUCT_CATEGORIES_WITH_ALL = {
	all: "전체",
	...PRODUCT_CATEGORIES,
};

export const PRODUCT_TYPES: Record<string, string> = {
	women: "여자",
	men: "남자",
	unisex: "여남공용",
	kids: "키즈",
};

export const PRODUCT_TYPES_WITH_ALL = {
	all: "전체",
	...PRODUCT_TYPES,
};

export const PRODUCT_STYLES: Record<string, string> = {
	street: "스트릿",
	formal: "정장",
	casual: "캐쥬얼",
	sports: "스포츠",
	vintage: "빈티지",
	dandy: "댄디",
	feminine: "페미닌",
	basic: "베이직",
	modern: "모던",
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
	stylelist = "stylelist",
	brand = "brand",
	admin = "admin",
}

export const PATH_ADD_USER = "add-user";
export const PATH_STYLELIST_USER = "stylist-user";
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
