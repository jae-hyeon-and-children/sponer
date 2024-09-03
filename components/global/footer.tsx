"use client";

import { useRecoilState } from "recoil";
import {
  showDefaultModalState,
  modalMessageState,
  modalTitleState,
} from "@/recoil/atoms";
import Modal from "@/components/global/modal";
import Image from "next/image";
import { footerContents } from "./footer-content";

interface FooterCompanyInfoProps {
  title: string;
  content: string;
}

function FooterCompanyInfo({ title, content }: FooterCompanyInfoProps) {
  return (
    <li>
      <div className="flex paragraph-1">
        <span className="basis-1/3 text-gray-400">{title}</span>
        <span className="basis-2/3 text-gray-300">{content}</span>
      </div>
    </li>
  );
}

interface FooterMenuProps {
  text: string;
  content: React.ReactNode;
}

function FooterMenu({ text, content }: FooterMenuProps) {
  const [showModal, setShowModal] = useRecoilState(showDefaultModalState);
  const [, setModalContent] = useRecoilState(modalMessageState);
  const [, setModalTitle] = useRecoilState(modalTitleState);

  const handleClick = () => {
    setModalContent(content);
    setModalTitle(text);
    setShowModal(true);
  };

  return (
    <li
      onClick={handleClick}
      className="[&:not(:last-child)]:lg:after:content-['|'] after:m-1 text-sm cursor-pointer"
    >
      {text}
    </li>
  );
}

export default function Footer() {
  const [showModal, setShowModal] = useRecoilState(showDefaultModalState);
  const [modalContent] = useRecoilState(modalMessageState);
  const [modalTitle] = useRecoilState(modalTitleState);

  return (
    <footer className="bg-gray-800 py-8 flex justify-center px-4 mt-24 lg:mt-20">
      <div className="lg:max-w-screen-2xl flex flex-col w-full lg:flex-row gap-6 lg:gap-12">
        <div className="shrink-0 text-gray-200 text-lg">
          <Image src="/sponer_Logo.png" alt="Logo" width={69} height={50} />
        </div>
        <div className="w-full flex flex-col gap-4 lg:gap-8">
          <div className="flex flex-col lg:flex-row lg:justify-between w-full">
            <div className="flex flex-col lg:flex-row w-full lg:gap-8">
              <div className="mb-6 lg:mb-0 basis-2/3">
                <h1 className="heading-3 text-gray-200 mb-3 text-lg">
                  회사 정보
                </h1>
                <ul className="flex flex-col gap-2 paragraph-1 text-gray-300">
                  <FooterCompanyInfo title="company" content="스포너" />
                  <FooterCompanyInfo
                    title="제휴 및 업무 문의"
                    content="sponer@sponer.com"
                  />
                  <FooterCompanyInfo title="연락처" content="010-4331-7797" />
                  <FooterCompanyInfo
                    title="address"
                    content="서울특별시 용산구 한강대로92길 15, 1층(갈월동)"
                  />
                  <FooterCompanyInfo
                    title="사업자등록번호"
                    content="306-36-36523"
                  />
                </ul>
              </div>
              <div className="mb-6 lg:mb-0 basis-1/3">
                <h1 className="heading-3 text-gray-200 mb-3 text-lg">
                  고객센터
                </h1>
                <ul className="flex flex-col gap-2 paragraph-1 text-gray-300">
                  <li className="text-sm">1544-1232</li>
                  <li className="text-sm">평일 오전 9시 ~ 오후 6시</li>
                </ul>
              </div>
            </div>
            <div className="mb-6">
              <ul className="flex gap-2">
                <li className="w-5 h-5 shrink-0 bg-slate-600 rounded-full"></li>
                <li className="w-5 h-5 shrink-0 bg-slate-600 rounded-full"></li>
                <li className="w-5 h-5 shrink-0 bg-slate-600 rounded-full"></li>
              </ul>
            </div>
          </div>
          <ul className="flex flex-col gap-1 paragraph-2 text-gray-400 lg:flex-row lg:gap-0 text-sm">
            {/* <FooterMenu
              text="회사 소개"
              content={footerContents.companyIntro}
            /> */}
            <FooterMenu
              text="개인정보처리방침"
              content={footerContents.privacyPolicy}
            />
            {/* <FooterMenu
              text="운영,관리방침"
              content={footerContents.operationPolicy}
            /> */}
            <FooterMenu
              text="서비스 이용약관"
              content={footerContents.termsOfService}
            />
          </ul>
        </div>
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-4">
            <h2 className="text-3xl font-bold mb-4">{modalTitle}</h2>
            <div className="text-gray-700">{modalContent}</div>
          </div>
        </Modal>
      )}
    </footer>
  );
}
