import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

interface AlgoliaProp {
	objectID?: string;
	[key: string]: any;
}

export interface IProduct extends AlgoliaProp {
	id?: string;
  createdAt: Timestamp;
  brandName?: string;
  brandId: string;
  genderCategory: string;
  height: string;
  productCategory: string;
  productImages: string[];
  size: string;
  styleCategory: string[];
  title: string;
}

export const ProductConverter = {
	fromFirestore: (product: QueryDocumentSnapshot): IProduct => {
		const id = product.id;
		const data = product.data();
		return {
			id,
			brandName: data.brandName,
			brandId: data.brandId,
			createdAt: data.createdAt,
			genderCategory: data.genderCategory,
			height: data.height,
			productCategory: data.productCategory,
			productImages: data.productImages,
			size: data.size,
			styleCategory: data.styleCategory,
			title: data.title,
		};
	},
};
