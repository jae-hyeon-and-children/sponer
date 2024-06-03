export interface IResponse<T = void> {
  status: number;
  success: boolean;
  message?: string;
  data?: T;
}
