import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

export interface IProduct {
  createdAt: Date;
  genderCategory: string;
  height: string;
  productCategory: string;
  productImages: string[];
  size: string;
  styleCategory: string[];
  title: string;
}

export const ProductConverter = {
  toFirestore: (product: IProduct) => {
    return {
      createdAt: product.createdAt,
      genderCategory: product.genderCategory,
      height: product.height,
      productCategory: product.productCategory,
      productImages: product.productImages,
      size: product.size,
      styleCategory: product.styleCategory,
      title: product.title,
    };
  },

  fromFirestore: (snapshot: QueryDocumentSnapshot): IProduct => {
    const data = snapshot.data();
    return {
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
