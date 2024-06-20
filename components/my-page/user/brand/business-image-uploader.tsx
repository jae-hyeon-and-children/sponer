import { ChangeEvent, MouseEvent } from "react";

interface BusinessImageUploaderProps {
	businessImg: File | null;
	onBusinessImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
	onBusinessImageClick: (event: MouseEvent<HTMLLabelElement>) => void;
	error: string | undefined;
}

export function BusinessImageUploader({
	businessImg,
	onBusinessImageUpload,
	onBusinessImageClick,
	error,
}: BusinessImageUploaderProps) {
	return (
		<div className="flex flex-col md:flex-row justify-between w-full">
			<span>사업자 등록증*</span>
			<span className="w-full md:w-[36rem] mt-4 md:mt-0">
				<input
					type="file"
					name="businessImageUrl"
					id="business-upload"
					className="hidden"
					onChange={onBusinessImageUpload}
				/>
				<label
					htmlFor="business-upload"
					className="cursor-pointer"
					onClick={onBusinessImageClick}
				>
					{businessImg && (
						<img
							src={URL.createObjectURL(businessImg)}
							alt="uploaded-business"
							className="object-cover w-full md:w-[36.625rem] h-[282px]"
						/>
					)}
				</label>
				{error && <span className="text-red-500">{error}</span>}
			</span>
		</div>
	);
}
