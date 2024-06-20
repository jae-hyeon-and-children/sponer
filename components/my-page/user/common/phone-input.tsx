import Input from "@/components/global/input";

interface PhoneInputProps {
	defaultValues: string[];
	error: string | undefined;
}

export function PhoneInput({ defaultValues, error }: PhoneInputProps) {
	return (
		<div className="flex flex-col md:flex-row justify-between w-full">
			<span>대표 연락처*</span>
			<div className="flex flex-col">
				<span className="flex flex-col md:flex-row gap-4 w-full md:w-[36rem] mt-4 md:mt-0">
					<Input
						name="phoneNumber1"
						type="text"
						defaultValue={defaultValues[0]}
					/>
					<Input
						name="phoneNumber2"
						type="text"
						defaultValue={defaultValues[1]}
					/>
					<Input
						name="phoneNumber3"
						type="text"
						defaultValue={defaultValues[2]}
					/>
				</span>
				{error && <span className="text-red-500">{error}</span>}
			</div>
		</div>
	);
}
