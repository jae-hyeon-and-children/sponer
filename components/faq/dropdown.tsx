"use client";
import { useState } from "react";

interface DropdownProps {
  question: string;
  answer: string;
}

export default function Dropdown({ question, answer }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full border-2 border-gray-200 mb-4 paragraph-1 rounded-xl overflow-hidden">
      <div
        className="w-full h-16 bg-white p-4 cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <span className="font-bold text-gray-800 py-5 px-8">{question}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="bg-gray-50 p-4 shadow-md text-gray-500 px-16 py-6">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
