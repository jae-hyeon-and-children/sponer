import { PhotoIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, DragEvent, MouseEvent } from "react";

interface ImageUploaderProps {
  images: File[];
  imageURLs?: string[];
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>, index: number) => void;
  onDrop: (event: DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onRemoveImage: (event: MouseEvent<HTMLButtonElement>, index: number) => void;
  onLabelClick: (event: MouseEvent<HTMLLabelElement>) => void;
  errors: string | undefined;
}

export function ImageUploader({
  images,
  imageURLs = [],
  onImageUpload,
  onDragStart,
  onDrop,
  onDragOver,
  onRemoveImage,
  onLabelClick,
  errors,
}: ImageUploaderProps) {
  return (
    <div className="w-full">
      <div className="label-1 flex flex-col justify-between w-full mb-4 lg:flex-row">
        <span>상품 이미지(최대 5장)*</span>
        <span className="text-gray-400 md:mt-0">
          제일 첫 번째 이미지가 상품의 대표 이미지가 됩니다. 이미지를 끌어당겨
          순서를 바꿀 수 있습니다.
        </span>
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onImageUpload}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer"
        onClick={onLabelClick}
      >
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-[1rem] w-full gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="relative h-[20rem] bg-gray-100 flex justify-center items-center border-2 border-gray-300 rounded-lg"
              draggable={!!images[index] || !!imageURLs[index]}
              onDragStart={(event) => onDragStart(event, index)}
              onDrop={(event) => onDrop(event, index)}
              onDragOver={onDragOver}
            >
              {images[index] ? (
                <>
                  <img
                    src={URL.createObjectURL(images[index])}
                    alt={`uploaded-${index}`}
                    className="object-cover h-[311px] w-full"
                    style={{ objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={(event) => onRemoveImage(event, index)}
                    className="absolute top-0 right-0 m-2 p-1 size-8 bg-white rounded-full text-gray-500 hover:text-gray-700"
                  >
                    X
                  </button>
                </>
              ) : imageURLs[index] ? (
                <>
                  <img
                    src={imageURLs[index]}
                    alt={`uploaded-${index}`}
                    className="object-cover h-[311px] w-full"
                    style={{ objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={(event) => onRemoveImage(event, index)}
                    className="absolute top-0 right-0 m-2 p-1 size-8 bg-white rounded-full text-gray-500 hover:text-gray-700"
                  >
                    X
                  </button>
                </>
              ) : (
                <>
                  <PhotoIcon className="w-12 h-12 text-gray-400" />
                  <div className="text-neutral-400 text-sm mt-2">
                    사진을 추가해주세요.
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </label>
      {errors && <span className="text-red-500">{errors}</span>}
    </div>
  );
}
