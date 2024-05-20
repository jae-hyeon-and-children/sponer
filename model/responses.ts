import { IProduct } from "./product";

export interface IResponse<T> {
  status: number;
  success: boolean;
  message?: string;
  data?: T;
}
