"use client";

import { ChangeEvent, InputHTMLAttributes, useState } from "react";

interface InputProps {
  name: string;
  errors?: string[];
  count?: number;
}

export default function Input({
  name,
  errors = [],
  count,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  const [testText, setTestText] = useState(0);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (count && e.target.value.length > count) {
      return;
    }
    setTestText(e.target.value.length);
  };

  return (
    <div className="flex flex-col gap-2 relative w-full ">
      <input
        onChange={onChange}
        maxLength={count ? count : 30}
        name={name}
        className="bg-transparent z-0 rounded-xl w-full h-16 py-5 px-4 border-2 border-gray-400  placeholder-gray-300"
        {...rest}
      />
      <div className="font-semibold h-full absolute right-1 flex items-center">
        {count !== undefined && (
          <span>
            {testText} / {count}
          </span>
        )}
      </div>
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
