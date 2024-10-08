"use client";

import React, {
  ChangeEvent,
  DragEvent,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import { PRODUCT_CATEGORIES_REVERSE } from "@/constants/variables";
import { useRouter } from "next/navigation";
import { IResponse } from "@/model/responses";
import {
  showCustomModalState,
  showDefaultModalState,
  toastState,
} from "@/recoil/atoms";
import { useRecoilState } from "recoil";
import { ISizeTable } from "@/constants/type-table";
import { getSizeTable } from "@/libs/utils/table";
import { uploadProduct } from "@/app/(my-page)/my-page/product/actions";
import { FormModal } from "./form-modal";
import { ImageUploader } from "./image-uploader";
import { ProductDetails } from "./product-details";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/global/LoadingSpinner";

export default function CreateProductForm() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [otherData, setFormData] = useState(new FormData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isShowModal, setShowModal] = useRecoilState(showCustomModalState);
  const [isShowSize, setShowSize] = useState<boolean>(false);

  const [toast, setToast] = useRecoilState(toastState);

  const [sizeTable, setSizeTable] = useState<ISizeTable | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isValidSiz, setIsValidSize] = useState<boolean>(true);
  const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const userType = session.user.userType;
    const userBrandId = session.user.uid;

    if (
      userType === "stylist" ||
      (userType !== "admin" && userBrandId !== session.user.uid)
    ) {
      router.push("/");
    }

    const newFormData = new FormData();
    images.forEach((image) => newFormData.append("images", image));
    if (selectedType) newFormData.append("selectedType", selectedType);
    if (selectedSize) newFormData.append("selectedSize", selectedSize);
    if (selectedGender) newFormData.append("selectedGender", selectedGender);
    selectedStyles.forEach((style) =>
      newFormData.append("selectedStyles", style)
    );

    newFormData.append("brandId", session?.user?.id);

    setFormData(newFormData);

    setSizeTable(getSizeTable(PRODUCT_CATEGORIES_REVERSE[selectedType!]));
  }, [
    selectedType,
    selectedSize,
    selectedGender,
    selectedStyles,
    images,
    session,
    status,
  ]);

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
  };

  const handleLabelClick = (event: MouseEvent<HTMLLabelElement>) => {
    event.stopPropagation();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const result: IResponse = await uploadProduct(otherData, formData);

    setIsLoading(false);
    if (!result.success && result.errors) {
      const newErrors: Record<string, string> = {};
      result.errors.forEach((error: any) => {
        if (Array.isArray(error.path) && error.path.length > 0) {
          newErrors[error.path[0]] = error.message;
        }
      });
      setErrors(newErrors);
    } else {
      setToast({
        isVisible: true,
        message: "상품 등록 성공",
        type: "success",
      });

      setTimeout(() => {
        router.push("/my-page/product-list");
      }, 1000);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
    setShowSize(true);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <FormModal
        isShowModal={isShowModal}
        isShowSize={isShowSize}
        modalContent={null}
        sizeTable={sizeTable}
        handleCloseModal={() => setShowModal(false)}
        handleCloseSize={() => setShowSize(false)}
      />
      <div className="h-fit flex flex-col justify-start items-start px-4 lg:px-24 pt-36 max-w-screen-2xl mx-auto">
        <div className="display mb-10 text-gray-900">상품 정보 등록</div>
        <form
          className="w-full flex flex-col mt-8 max-w-screen-xl bg-white p-8 rounded-lg " //shadow-md
          onSubmit={handleSubmit}
        >
          <ImageUploader
            images={images}
            onImageUpload={handleImageUpload}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onRemoveImage={handleRemoveImage}
            onLabelClick={handleLabelClick}
            errors={errors.productImages}
          />
          <ProductDetails
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
          />
          <div className="mt-16 w-full h-fit flex justify-center">
            <button
              type="submit"
              className="bg-primary px-12 py-4 rounded-3xl text-white hover:bg-blue-700 transition"
            >
              상품 등록하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
