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
  switch (category) {
    case "tops":
      return { header: TOP_SIZE_TABLE_HEADER, body: TOP_SIZE_TABLE_BODY };
    case "pants":
      return { header: PANTS_SIZE_TABLE_HEADER, body: PANTS_SIZE_TABLE_BODY };
    case "dresses":
      return { header: DRESS_SIZE_TABLE_HEADER, body: DRESS_SIZE_TABLE_BODY };
    case "skirts":
      return { header: SKIRT_SIZE_TABLE_HEADER, body: SKIRT_SIZE_TABLE_BODY };
    case "hats":
      return { header: HAT_SIZE_TABLE_HEADER, body: HAT_SIZE_TABLE_BODY };
    default:
      return null;
  }
}
