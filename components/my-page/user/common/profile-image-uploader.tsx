import { ChangeEvent, MouseEvent } from "react";

interface ProfileImageUploaderProps {
	profileImg: File | null;
	onProfileImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
	onProfileImageClick: (event: MouseEvent<HTMLLabelElement>) => void;
	error: string | undefined;
}

export function ProfileImageUploader({
	profileImg,
	onProfileImageUpload,
	onProfileImageClick,
	error,
}: ProfileImageUploaderProps) {
	return (
		<div className="flex flex-col md:flex-row justify-between w-full">
			<span>프로필 사진*</span>
			<span className="w-full md:w-[36rem] flex justify-start mt-4 md:mt-0">
				<input
					type="file"
					name="profileImage"
					accept="image/*"
					className="hidden"
					onChange={onProfileImageUpload}
					id="profile-upload"
				/>
				<label
					htmlFor="profile-upload"
					className="cursor-pointer"
					onClick={onProfileImageClick}
				>
					{profileImg && (
						<img
							src={URL.createObjectURL(profileImg)}
							alt="uploaded-profile"
							className="object-cover rounded-full w-52 h-52"
						/>
					)}
				</label>
				{error && <span className="text-red-500">{error}</span>}
			</span>
		</div>
	);
}
