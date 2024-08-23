"use client";

import { ProductLabel } from "@/components/my-page/label";
import React, {
  ChangeEvent,
  DragEvent,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORIES_REVERSE,
  PRODUCT_HEIGHT,
  PRODUCT_SIZE,
  PRODUCT_STYLES,
  PRODUCT_TYPES,
} from "@/constants/variables";
import Input from "@/components/global/input";

import { useRouter } from "next/navigation";
import { IResponse } from "@/model/responses";
import Modal from "@/components/global/modal";
import { showDefaultModalState, toastState } from "@/recoil/atoms";
import { useRecoilState } from "recoil";
import { ISizeTable } from "@/constants/type-table";
import { getSizeTable } from "@/libs/utils/table";
import SizeTable from "@/components/global/size-table";
import { uploadProduct } from "@/app/(my-page)/my-page/product/actions";
import { FormModal } from "./form-modal";
import { ImageUploader } from "./image-uploader";
import { ProductDetails } from "./product-details";
import { useSession } from "next-auth/react";

export default function CreateProductForm() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [otherData, setFormData] = useState(new FormData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isShowModal, setShowModal] = useRecoilState(showDefaultModalState);
  const [isShowSize, setShowSize] = useState<boolean>(false);

  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [toast, setToast] = useRecoilState(toastState); // Toast 상태 관리

  const [sizeTable, setSizeTable] = useState<ISizeTable | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

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
    setImages((prevImages) => [
      ...prevImages,
      ...files.slice(0, 5 - prevImages.length),
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
    const formData = new FormData(event.currentTarget);
    const result: IResponse = await uploadProduct(otherData, formData);

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
      }, 2000);
    }
  };

  // const handleCloseModal = () => {
  //   router.push("/my-page/product-list");
  // };

  const handleCloseSize = () => {
    setShowSize(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
    setShowSize(true);
  };

  return (
    <>
      <FormModal
        isShowModal={isShowModal}
        isShowSize={isShowSize}
        modalContent={modalContent}
        sizeTable={sizeTable}
        // handleCloseModal={handleCloseModal}
        handleCloseSize={handleCloseSize}
      />
      <div className="h-fit flex flex-col justify-start items-start px-4 lg:px-36 pt-60 max-w-screen-2xl">
        <div className="display">상품 정보 등록</div>
        <form
          className="w-full flex flex-col mt-16 max-w-screen-xl"
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
            // selectedHeight={selected}
            errors={errors}
            selectType={selectType}
            selectSize={selectSize}
            selectGender={selectGender}
            toggleStyle={toggleStyle}
            handleShowModal={handleShowModal}
          />
          <div className="mt-[5rem] w-full h-fit flex justify-center label-1 text-gray-100">
            <button type="submit" className="bg-primary px-12 py-4 rounded-3xl">
              상품 등록하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
