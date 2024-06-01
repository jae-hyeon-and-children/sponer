export type ISizeTable = {
  header: string[];
  body: Object[];
};

export interface ITopSize {
  size: string;
  totalLength: number;
  shoulderWidth: number;
  chestWidth: number;
  sleeveLength: number;
}

export interface IPantsSize {
  size: string;
  totalLength: number;
  waistWidth: number;
  hipWidth: number;
  thighWidth: number;
  rise: number;
  hemWidth: number;
}

export interface IDressSize {
  size: string;
  totalLength: number;
  shoulderWidth: number;
  chestWidth: number;
  sleeveLength: number;
}

export interface ISkirtSize {
  size: string;
  totalLength: number;
  waistWidth: number;
  hipWidth: number;
  hemWidth: number;
}

export interface IHatSize {
  size: string;
  headCircum: number;
  depth: number;
  brimLength: number;
}
