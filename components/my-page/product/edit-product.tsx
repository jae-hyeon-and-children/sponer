"use client";

import { ChangeEvent, DragEvent, MouseEvent, useEffect, useState } from "react";
import Input from "../../global/input";
import { ProductLabel } from "../label";
import {
	PRODUCT_CATEGORIES,
	PRODUCT_CATEGORIES_REVERSE,
	PRODUCT_HEIGHT,
	PRODUCT_SIZE,
	PRODUCT_STYLES,
	PRODUCT_TYPES,
} from "@/constants/variables";
import {
	deleteProduct,
	updateProduct,
} from "@/app/(my-page)/my-page/product/[id]/actions";
import { IProduct } from "@/model/product";
import { useRouter } from "next/navigation";
// import useAuth from "@/libs/auth";
import { IResponse } from "@/model/responses";
import Modal from "../../global/modal";
import { useRecoilState } from "recoil";
import { showDefaultModalState } from "@/recoil/atoms";
import { ISizeTable } from "@/constants/type-table";
import { getSizeTable } from "@/libs/utils/table";
import SizeTable from "../../global/size-table";
import { FormModal } from "./form-modal";
import { ProductDetails } from "./product-details";
import { ImageUploader } from "./image-uploader";
import { useSession } from "next-auth/react";

export const base64ToFile = (
	base64Data: string,
	fileName: string,
	contentType: string = "image/jpeg"
) => {
	const byteString = atob(base64Data.split(",")[1]);
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	const blob = new Blob([ab], { type: contentType });
	return new File([blob], fileName, { type: contentType });
};

export default function EditProductForm(data: any) {
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [selectedGender, setSelectedGender] = useState<string | null>(null);
	const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
	const [selectedHeight, setSelectedHeight] = useState<string | null>(null);
	const [images, setImages] = useState<File[]>([]);
	const [imageURLs, setImageURLs] = useState<string[]>([]);
	const [fileNames, setFileNames] = useState<string[]>([]);
	const [initialData, setInitialData] = useState<IProduct | null>(null);
	const [otherData, setFormData] = useState(new FormData());
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isShowModal, setShowModal] = useRecoilState(showDefaultModalState);
	const [isShowSize, setShowSize] = useState<boolean>(false);

	const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

	const [sizeTable, setSizeTable] = useState<ISizeTable | null>(null);

	const { data: session, status } = useSession();

	const [loading, setLoading] = useState(true);

	const router = useRouter();

	// useEffect(() => {
	// 	if (
	// 		status === "unauthenticated" ||
	// 		(session?.user?.id !== params.id && session?.user?.userType !== "admin")
	// 	) {
	// 		router.push("/");
	// 	}
	// }, [status, session, router]);

	useEffect(() => {
		if (data) {
			setInitialData(data.data);
			setSelectedType(data.data.productCategory);
			setSelectedSize(data.data.size);
			setSelectedGender(data.data.genderCategory);
			setSelectedStyles(data.data.styleCategory);
			setSelectedHeight(data.data.height);
			setImageURLs(data.data.productImages || []);
			setFileNames(data.data.fileNames || []);
		}
	}, [data]);

	useEffect(() => {
		const newFormData = new FormData();
		if (images.length !== 0)
			images.forEach((image) => newFormData.append("images", image));
		if (images.length === 0)
			imageURLs.forEach((image) => newFormData.append("images", image));
		if (selectedType) newFormData.append("selectedType", selectedType);
		if (selectedSize) newFormData.append("selectedSize", selectedSize);
		if (selectedGender) newFormData.append("selectedGender", selectedGender);
		if (selectedHeight) newFormData.append("selectedHeight", selectedHeight);
		if (selectedStyles) {
			selectedStyles.forEach((style) =>
				newFormData.append("selectedStyles", style)
			);
		}
		if (data) newFormData.append("productId", data.data.id);
		setFormData(newFormData);

		setSizeTable(getSizeTable(PRODUCT_CATEGORIES_REVERSE[selectedType!]));
	}, [
		selectedType,
		selectedSize,
		selectedGender,
		selectedStyles,
		selectedHeight,
		images,
	]);

	useEffect(() => {
		const convertBase64ToFile = async () => {
			if (imageURLs.length > 0) {
				const files = imageURLs.map((url, index) =>
					base64ToFile(url, fileNames[index])
				);
				console.log(files);
				setImages(files);
			}
		};
		convertBase64ToFile();
	}, [imageURLs]);

	const selectType = (item: string) => setSelectedType(item);
	const selectSize = (item: string) => setSelectedSize(item);
	const selectGender = (item: string) => setSelectedGender(item);
	const toggleStyle = (item: string) =>
		setSelectedStyles((prev) =>
			prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
		);
	const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setImages((prevImages) => [
			...prevImages,
			...files.slice(0, 5 - prevImages.length),
		]);

		setImageURLs([]);
	};

	const handleDragStart = (event: DragEvent<HTMLDivElement>, index: number) => {
		event.dataTransfer.setData("index", index.toString());
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
		const draggedIndex = parseInt(event.dataTransfer.getData("index"), 10);
		const reorderedImages = [...images];
		const [draggedImage] = reorderedImages.splice(draggedIndex, 1);
		reorderedImages.splice(index, 0, draggedImage);
		setImages(reorderedImages);
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleRemoveImage = (
		event: MouseEvent<HTMLButtonElement>,
		index: number
	) => {
		event.stopPropagation();
		setImages((prevImages) => prevImages.filter((_, i) => i !== index));
		setImageURLs((prevURLs) => prevURLs.filter((_, i) => i !== index));
	};

	const handleLabelClick = (event: MouseEvent<HTMLLabelElement>) => {
		event.stopPropagation();
	};

	const handleSubmitUpdate = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		const productId = formData.get("productId") as string;
		const result = await updateProduct(otherData, formData);

		if (!result.success && result.errors) {
			const newErrors: Record<string, string> = {};
			result.errors.forEach((error: any) => {
				if (Array.isArray(error.path) && error.path.length > 0) {
					newErrors[error.path[0]] = error.message;
				}
			});
			setErrors(newErrors);
		} else {
			setModalContent(<div>상품 정보 수정 성공</div>);
			setShowModal(true);
		}
	};

	const handleSubmitDelete = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		const productId = data.data.id;
		const result: IResponse = await deleteProduct(productId);

		if (result.success) {
			alert(result.message);
			setModalContent(<div>상품 삭제 성공</div>);
			setShowModal(true);
		} else {
			setModalContent(<div>상품 삭제 실패</div>);
			setShowModal(true);
		}
	};

	const handleCloseModal = () => {
		router.push("/my-page/product-list");
	};

	const handleCloseSize = () => {
		setShowSize(false);
	};

	const handleShowModal = () => {
		setShowModal(true);
		setShowSize(true);
	};

	if (!initialData) return <div>Loading...</div>;

	if (loading) {
		return <div>로딩 중...</div>;
	}

	// if (!user) {
	// 	return <div>유저를 찾을 수 없습니다.</div>;
	// }

	return (
		<>
			<FormModal
				isShowModal={isShowModal}
				isShowSize={isShowSize}
				modalContent={modalContent}
				sizeTable={sizeTable}
				handleCloseModal={handleCloseModal}
				handleCloseSize={handleCloseSize}
			/>
			<div className="h-fit flex flex-col justify-start items-start px-4 lg:px-36 pt-60 max-w-screen-2xl">
				<div className="display">상품 정보 수정</div>
				<form
					className="w-full flex flex-col mt-16 max-w-screen-xl"
					onSubmit={handleSubmitUpdate}
				>
					<ImageUploader
						images={images}
						imageURLs={imageURLs}
						onImageUpload={handleImageUpload}
						onDragStart={handleDragStart}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onRemoveImage={handleRemoveImage}
						onLabelClick={handleLabelClick}
						errors={errors.productImages}
					/>
					<ProductDetails
						initialData={initialData}
						selectedType={selectedType}
						selectedSize={selectedSize}
						selectedGender={selectedGender}
						selectedStyles={selectedStyles}
						errors={errors}
						selectType={selectType}
						selectSize={selectSize}
						selectGender={selectGender}
						toggleStyle={toggleStyle}
						handleShowModal={handleShowModal}
						selectedHeight={selectedHeight}
					/>
					<div className="mt-[5rem] w-full h-fit flex justify-center label-1 text-gray-100">
						<button type="submit" className="bg-primary px-12 py-4 rounded-3xl">
							상품 수정하기
						</button>
					</div>
				</form>
				<form
					className="w-full flex flex-col mt-4"
					onSubmit={handleSubmitDelete}
				>
					<div className="w-full h-fit flex justify-center label-1 text-gray-100">
						<button type="submit" className="bg-primary px-12 py-4 rounded-3xl">
							상품 삭제하기
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
