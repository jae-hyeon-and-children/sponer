import Input from "@/components/global/input";

interface TextInputProps {
	label: string;
	name: string;
	type: string;
	defaultValue: string;
	error: string | undefined;
}

export function TextInput({
	label,
	name,
	type,
	defaultValue,
	error,
}: TextInputProps) {
	return (
		<div className="flex flex-col md:flex-row justify-between w-full">
			<span>{label}</span>
			<span className="w-full md:w-[36rem] mt-4 md:mt-0">
				<Input name={name} type={type} defaultValue={defaultValue} />
				{error && <span className="text-red-500">{error}</span>}
			</span>
		</div>
	);
}
