import Input from "@/components/global/input";

interface PhoneInputProps {
  defaultValues: string;
  error: string | undefined;
}

export function PhoneInput({ defaultValues, error }: PhoneInputProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between w-full">
      <span>대표 연락처*</span>
      <div className="flex flex-col">
        <span className="flex flex-col md:flex-row gap-4 w-full md:w-[36rem] mt-4 md:mt-0">
          <Input
            name="phoneNumber"
            type="tel"
            placeholder="010-1234-5678"
            defaultValue={defaultValues}
          />
        </span>
        {error && <span className="text-red-500">{error}</span>}
      </div>
    </div>
  );
}
