import { Timestamp } from "firebase/firestore";

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
