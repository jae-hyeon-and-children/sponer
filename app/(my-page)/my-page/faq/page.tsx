"use client";
import Dropdown from "@/components/faq/dropdown";
import { ProductSideBar } from "@/components/my-page/side-bar";

export default function faqPage() {
  return (
    <>
      <main className="w-full flex">
        <ProductSideBar />
        <div className="w-full mt-20">
          <div className="w-full h-52 bg-primary pl-4 md:pl-36">
            <div className="display text-gray-100 pt-36">자주 묻는 질문</div>
          </div>
          <div className="w-full max-w-screen-2xl h-fit mt-20 flex-col text-center px-4 md:px-36">
            <Dropdown />
            <Dropdown />
            <Dropdown />
            <Dropdown />
            <Dropdown />
            <Dropdown />
            <Dropdown />
            <Dropdown />
            <Dropdown />
          </div>
        </div>
      </main>
    </>
  );
}
