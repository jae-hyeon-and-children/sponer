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

import { IResponse } from "@/model/responses";
import Modal from "../../global/modal";
import { useRecoilState } from "recoil";
import {
  showCustomModalState,
  showDefaultModalState,
  toastState,
} from "@/recoil/atoms";
import { ISizeTable } from "@/constants/type-table";
import { getSizeTable } from "@/libs/utils/table";
import SizeTable from "../../global/size-table";
import { FormModal } from "./form-modal";
import { ProductDetails } from "./product-details";
import { ImageUploader } from "./image-uploader";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/global/LoadingSpinner";

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

  const [isShowSize, setShowSize] = useState<boolean>(false);

  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [sizeTable, setSizeTable] = useState<ISizeTable | null>(null);
  const [isValidSiz, setIsValidSize] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [toast, setToast] = useRecoilState(toastState);
  const [isShowModal, setShowModal] = useRecoilState(showCustomModalState);
  const { data: session, status } = useSession();
  const router = useRouter();
  const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const productBrandId = data.data.brandId;
    const userBrandId = session?.user?.uid;
    const userType = session?.user?.userType;

    if (
      userType === "stylist" ||
      (userType !== "admin" && userBrandId !== productBrandId)
    ) {
      router.push("/");
    }

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
  }, [session, status, data]);

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
    const validFiles: File[] = [];
    let validSize = true;

    files.forEach((file) => {
      console.log(`File size of ${file.name}: ${file.size} bytes`);
      if (file.size > MAX_IMAGE_SIZE) {
        validSize = false;
      } else {
        validFiles.push(file);
      }
    });

    if (!validSize) {
      setToast({
        isVisible: true,
        message: "이미지 크기는 4MB를 초과할 수 없습니다.",
        type: "error",
      });
      setIsValidSize(false);
    } else {
      setIsValidSize(true);
    }
    setImages((prevImages) => [
      ...prevImages,
      ...validFiles.slice(0, 5 - prevImages.length),
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
    setIsLoading(true); // 로딩 시작
    const formData = new FormData(event.currentTarget);

    const productId = formData.get("productId") as string;
    const result = await updateProduct(otherData, formData);

    setIsLoading(false); // 로딩 종료
    if (!result.success && result.errors) {
      const newErrors: Record<string, string> = {};
      result.errors.forEach((error: any) => {
        if (Array.isArray(error.path) && error.path.length > 0) {
          newErrors[error.path[0]] = error.message;
        }
      });
      setErrors(newErrors);
      setToast({
        isVisible: true,
        message: "상품 수정 실패",
        type: "error",
      });
    } else {
      setToast({
        isVisible: true,
        message: "상품 수정 성공",
        type: "success",
      });

      setTimeout(() => {
        router.push("/my-page/product-list");
      }, 1000);
    }
  };

  const handleSubmitDelete = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsLoading(true); // 로딩 시작

    const productId = data.data.id;
    const result: IResponse = await deleteProduct(productId);

    setIsLoading(false); // 로딩 종료
    if (result.success) {
      setToast({
        isVisible: true,
        message: "상품 삭제 성공",
        type: "success",
      });

      setTimeout(() => {
        router.push("/my-page/product-list");
      }, 1000);
    } else {
      setToast({
        isVisible: true,
        message: "상품 삭제 실패",
        type: "error",
      });
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
    setShowSize(true);
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <FormModal
        isShowModal={isShowModal}
        isShowSize={isShowSize}
        modalContent={modalContent}
        sizeTable={sizeTable}
        handleCloseModal={() => setShowModal(false)}
        handleCloseSize={() => setShowSize(false)}
      />
      <div className="h-fit flex flex-col justify-start items-start px-4 lg:px-24 pt-36 max-w-screen-2xl mx-auto">
        <div className="display mb-10 text-gray-900">상품 정보 수정</div>
        <form
          className="w-full flex flex-col mt-8 max-w-screen-xl bg-white p-8 rounded-lg "
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
          {/* Button group */}
          <div className="mt-16 w-full h-fit flex justify-center gap-4">
            <button
              type="submit"
              className="bg-primary px-12 py-4 rounded-3xl text-white hover:bg-blue-700 transition max-w-xs"
            >
              상품 수정하기
            </button>
          </div>
        </form>

        {/* Separate form for deletion */}
        <form
          className="w-full flex flex-col mt-4"
          onSubmit={handleSubmitDelete}
        >
          <div className="w-full h-fit flex justify-center label-1 text-gray-100">
            <button
              type="submit"
              className="bg-red-500 px-12 py-4 rounded-3xl text-white hover:bg-red-700 transition max-w-xs"
            >
              상품 삭제하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
