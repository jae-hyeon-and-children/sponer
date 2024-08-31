import {
  DRESS_SIZE_TABLE_BODY,
  DRESS_SIZE_TABLE_HEADER,
  HAT_SIZE_TABLE_BODY,
  HAT_SIZE_TABLE_HEADER,
  PANTS_SIZE_TABLE_BODY,
  PANTS_SIZE_TABLE_HEADER,
  SKIRT_SIZE_TABLE_BODY,
  SKIRT_SIZE_TABLE_HEADER,
  TOP_SIZE_TABLE_BODY,
  TOP_SIZE_TABLE_HEADER,
} from "@/constants/size-table";
import { ISizeTable } from "@/constants/type-table";
import { PRODUCT_CATEGORIES } from "@/constants/variables";

export function getSizeTable(category: string): ISizeTable | null {
  console.log("getSizeTable called with category:", category);

  switch (category) {
    case PRODUCT_CATEGORIES["상의"]:
      return { header: TOP_SIZE_TABLE_HEADER, body: TOP_SIZE_TABLE_BODY };
    case PRODUCT_CATEGORIES["바지"]:
      return { header: PANTS_SIZE_TABLE_HEADER, body: PANTS_SIZE_TABLE_BODY };
    case PRODUCT_CATEGORIES["원피스"]:
      return { header: DRESS_SIZE_TABLE_HEADER, body: DRESS_SIZE_TABLE_BODY };
    case PRODUCT_CATEGORIES["스커트"]:
      return { header: SKIRT_SIZE_TABLE_HEADER, body: SKIRT_SIZE_TABLE_BODY };
    case PRODUCT_CATEGORIES["모자"]:
      return { header: HAT_SIZE_TABLE_HEADER, body: HAT_SIZE_TABLE_BODY };
    default:
      console.log("No matching category found, returning null");
      return null;
  }
}
