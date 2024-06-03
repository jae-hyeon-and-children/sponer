import {
  IDressSize,
  IHatSize,
  IPantsSize,
  ISkirtSize,
  ITopSize,
} from "./type-table";

export const TOP_SIZE_TABLE_HEADER = [
  "cm",
  "총장",
  "어깨너비",
  "가슴단면",
  "소매길이",
];

export const PANTS_SIZE_TABLE_HEADER = [
  "cm",
  "총장",
  "허리단면",
  "엉덩이단면",
  "허벅지단면",
  "밑위",
  "밑단단면",
];

export const DRESS_SIZE_TABLE_HEADER = [
  "cm",
  "총장",
  "어깨너비",
  "가슴단면",
  "소매길이",
];

export const SKIRT_SIZE_TABLE_HEADER = [
  "cm",
  "총장",
  "허리단면",
  "엉덩이단면",
  "밑단단면",
];

export const HAT_SIZE_TABLE_HEADER = ["cm", "머리둘레", "깊이", "챙길이"];

export const TOP_SIZE_TABLE_BODY: ITopSize[] = [
  {
    size: "S",
    totalLength: 67.5,
    shoulderWidth: 47,
    chestWidth: 51,
    sleeveLength: 57,
  },
  {
    size: "M",
    totalLength: 69,
    shoulderWidth: 48.5,
    chestWidth: 53.5,
    sleeveLength: 58,
  },
  {
    size: "L",
    totalLength: 70.5,
    shoulderWidth: 50,
    chestWidth: 56,
    sleeveLength: 59,
  },
  {
    size: "XL",
    totalLength: 72,
    shoulderWidth: 51.5,
    chestWidth: 58.5,
    sleeveLength: 60,
  },
  {
    size: "2XL",
    totalLength: 73,
    shoulderWidth: 53,
    chestWidth: 61,
    sleeveLength: 60.5,
  },
  {
    size: "3XL",
    totalLength: 74,
    shoulderWidth: 54.5,
    chestWidth: 63.5,
    sleeveLength: 61,
  },
];

export const PANTS_SIZE_TABLE_BODY: IPantsSize[] = [
  {
    size: "S",
    totalLength: 105,
    waistWidth: 36,
    hipWidth: 55.5,
    thighWidth: 32,
    rise: 34,
    hemWidth: 24,
  },
  {
    size: "M",
    totalLength: 105,
    waistWidth: 38,
    hipWidth: 57,
    thighWidth: 32.5,
    rise: 33,
    hemWidth: 24,
  },
  {
    size: "L",
    totalLength: 107,
    waistWidth: 40,
    hipWidth: 59.5,
    thighWidth: 34,
    rise: 34,
    hemWidth: 25,
  },
  {
    size: "XL",
    totalLength: 109,
    waistWidth: 42,
    hipWidth: 61.5,
    thighWidth: 35.5,
    rise: 35,
    hemWidth: 26,
  },
];

export const DRESS_SIZE_TABLE_BODY: IDressSize[] = [
  {
    size: "85",
    totalLength: 108,
    shoulderWidth: 41,
    chestWidth: 51,
    sleeveLength: 24,
  },
  {
    size: "90",
    totalLength: 110,
    shoulderWidth: 43,
    chestWidth: 54,
    sleeveLength: 25,
  },
  {
    size: "95",
    totalLength: 112,
    shoulderWidth: 45,
    chestWidth: 57,
    sleeveLength: 26,
  },
];

export const SKIRT_SIZE_TABLE_BODY: ISkirtSize[] = [
  {
    size: "XXS",
    totalLength: 37,
    waistWidth: 32,
    hipWidth: 43.5,
    hemWidth: 53.5,
  },
  {
    size: "XS",
    totalLength: 37,
    waistWidth: 34,
    hipWidth: 45.5,
    hemWidth: 55.5,
  },
  {
    size: "S",
    totalLength: 38,
    waistWidth: 35.5,
    hipWidth: 47,
    hemWidth: 57,
  },
  {
    size: "M",
    totalLength: 39,
    waistWidth: 37,
    hipWidth: 48.5,
    hemWidth: 58.5,
  },
  {
    size: "L",
    totalLength: 40,
    waistWidth: 38.5,
    hipWidth: 50,
    hemWidth: 60,
  },
];

export const HAT_SIZE_TABLE_BODY: IHatSize[] = [
  {
    size: "M",
    headCircum: 58,
    depth: 17,
    brimLength: 7.7,
  },
  {
    size: "L",
    headCircum: 62,
    depth: 17.5,
    brimLength: 7.7,
  },
];
