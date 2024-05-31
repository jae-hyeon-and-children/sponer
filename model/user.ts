import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

export interface IUser {
  address: string;
  affiliation?: string;
  approve?: boolean;
  brandName?: string;
  businessImageUrl?: string;
  email: string;
  homepage?: string;
  loginType: string;
  name: string;
  phoneNumber: string;
  profileImage: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userType: string;
  nickName?: string;
}

export interface IHistory {
  approve: boolean;
  brandName: string;
  createdAt: Timestamp;
  reason?: string;
}

export const UserConverter = {
  fromFirestore: (user: QueryDocumentSnapshot): IUser => {
    const data = user.data();
    return {
      address: data.address,
      affiliation: data.affiliation,
      approve: data.approve,
      brandName: data.brandName,
      businessImageUrl: data.businessImageUrl,
      email: data.email,
      homepage: data.homepage,
      loginType: data.loginType,
      name: data.name,
      phoneNumber: data.phoneNumber,
      profileImage: data.profileImage,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userType: data.userType,
      nickName: data.nickName,
    };
  },
};
