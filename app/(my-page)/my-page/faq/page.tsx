"use client";
import Dropdown from "@/components/faq/dropdown";
import { ProductSideBar } from "@/components/my-page/side-bar";

export default function faqPage() {
  return (
    <>
      <div className="w-full h-[84px] bg-gray-300 flex justify-center items-center fixed top-0 z-20">
        임시 Header
      </div>
      <main className="w-full h-screen flex">
        <ProductSideBar />
        <div className="w-full ml-[15rem]">
          <div className="w-full h-[10rem] bg-primary mt-[5.25rem] flex justify-center relative">
            <div className="h-fit flex w-5/6 justify-between absolute bottom-8">
              <div className="display text-gray-100">자주 묻는 질문</div>
            </div>
          </div>
          <div className="w-[952px] max-w-screen-2xl h-fit mt-20 ml-36">
            <Dropdown />
            <Dropdown />
            <Dropdown />
          </div>
        </div>
      </main>
    </>
  );
}
