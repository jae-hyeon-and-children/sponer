import { Timestamp } from "firebase/firestore";

export interface IUser {
  success: boolean | undefined;
  message: string;
  address: string;
  affiliation?: string;
  approve?: boolean;
  brandName?: string;
  businessImageUrl?: string;
  email: string;
  nickName?: string;
  homepage?: string;
  loginType: string;
  name: string;
  phoneNumber: string;
  profileImage: string;
  createdAt: Timestamp;
  userType: string;
}
