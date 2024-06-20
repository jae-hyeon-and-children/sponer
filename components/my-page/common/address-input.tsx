import React from "react";
import AddressForm from "../../global/address";

interface AddressInputProps {
	defaultAddress: string;
	error: string | undefined;
}

export function AddressInput({ defaultAddress, error }: AddressInputProps) {
	return (
		<div className="flex flex-col md:flex-row justify-between w-full">
			<span>사업장 주소*</span>
			<span className="w-full md:w-[36rem] mt-4 md:mt-0">
				<AddressForm fullAddress={defaultAddress} />
				{error && <span className="text-red-500">{error}</span>}
			</span>
		</div>
	);
}
