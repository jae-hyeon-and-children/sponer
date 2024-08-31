// "use client";

// import {
//   deleteUserData,
//   isUserTypeBrand,
// } from "@/app/(my-page)/my-page/[id]/actions";
// import { IResponse } from "@/model/responses";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Modal from "./my-page-modal";
// import { useSession } from "next-auth/react";
// import { createChatRoom } from "@/libs/api/chat-room";
// import { IUser } from "@/model/user";
// import { Timestamp } from "firebase/firestore";

// {
//   /* 아직은 필요가 없음 */
// }
// // const SkeletonSidebar = () => (
// //   <div className="w-[15rem] border-r border-r-gray-200 flex-col sticky top-0 left-0 h-screen hidden lg:flex">
// //     <div className="flex flex-col pt-40 pl-14 gap-11 animate-pulse">
// //       <div className="h-fit flex flex-col gap-6 flex-nowrap">
// //         <div className="bg-slate-200 w-32 h-8 rounded-xl"></div>
// //         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
// //         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
// //         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
// //       </div>
// //       <div className="h-fit flex flex-col gap-6 flex-nowrap">
// //         <div className="bg-slate-200 w-32 h-8 rounded-xl"></div>
// //         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
// //       </div>
// //       <div className="h-fit flex flex-col gap-6 flex-nowrap">
// //         <div className="bg-slate-200 w-32 h-8 rounded-xl"></div>
// //         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
// //         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
// //       </div>
// //     </div>
// //   </div>
// // );

// export const ProductSideBar = () => {
//   const { data: session, status } = useSession();
//   const [isBrandUser, setIsBrandUser] = useState<boolean | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const pathname = usePathname();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserType = async (userUid: string) => {
//       const isBrand = await isUserTypeBrand(userUid);
//       setIsBrandUser(isBrand);
//       setLoading(false);
//       console.log(userUid);
//     };

//     if (status === "authenticated" && session?.user?.id) {
//       fetchUserType(session.user.id);
//     } else {
//       setIsBrandUser(false);
//       setLoading(false);
//     }
//   }, [status, session]);

//   {
//     /* 아직은 필요가 없음 */
//   }
//   // const confirmDeleteUser = async () => {
//   //   if (session?.user?.id) {
//   //     const result: IResponse = await deleteUserData(session.user.id);
//   //     setIsModalOpen(false);

//   //     alert(result.message);
//   //     if (result.success) {
//   //       router.push("/");
//   //     }
//   //   }
//   // };

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const isActive = (path: string) => pathname === path;

//   const renderLink = (
//     href: string,
//     text: string,
//     isActiveCondition: boolean
//   ) => (
//     <Link href={href} legacyBehavior>
//       <a
//         className={`label-2 pt-2 ${
//           isActiveCondition ? "text-primary font-bold" : "text-gray-400"
//         }`}
//       >
//         {text}
//       </a>
//     </Link>
//   );

//   if (status !== "authenticated") {
//     return null;
//   }

//   return (
//     <div className="w-[15rem] border-r border-r-gray-200 flex-col sticky top-0 left-0 h-screen hidden lg:flex">
//       <div className="flex flex-col pt-40 pl-14 gap-11">
//         <div className="h-fit flex flex-col gap-6 flex-nowrap">
//           <span className="text-gray-900 heading-2">회원 정보</span>
//           {renderLink(
//             `/my-page/${session.user.id}`,
//             "프로필 관리",
//             isActive(`/my-page/${session.user.id}`)
//           )}
//           {isBrandUser &&
//             renderLink(
//               `/my-page/history/${session.user.id}`,
//               "브랜드 신청 이력",
//               isActive(`/my-page/history/${session.user.id}`)
//             )}
//           <Link
//             href="/add-user"
//             className="text-gray-400 label-2 pt-2 cursor-pointer"
//           >
//             소속 정하기
//           </Link>
//           {/* 아직은 필요가 없음 */}
//           {/* <span
//             onClick={openModal}
//             className="text-gray-400 label-2 pt-2 cursor-pointer"
//           >
//             탈퇴하기
//           </span> */}
//         </div>
//         {isBrandUser && (
//           <div className="h-fit flex flex-col gap-6 flex-nowrap">
//             <span className="text-gray-900 heading-2">상품 관리</span>
//             {renderLink(
//               `/my-page/product-list`,
//               "상품 관리",
//               isActive(`/my-page/product-list`)
//             )}
//           </div>
//         )}
//         <div className="h-fit flex flex-col gap-6 flex-nowrap">
//           {/* <span className="text-gray-900 heading-2">문의</span> */}

//           {/* 아직은 필요가 없음 */}
//           {/* {renderLink(
//             `/my-page/faq`,
//             "FAQ 자주 묻는 질문",
//             isActive(`/my-page/faq`)
//           )} */}
//         </div>
//       </div>
//       {/* 아직은 필요가 없음 */}
//       {/* <Modal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         onConfirm={confirmDeleteUser}
//       >
//         <p>정말 탈퇴하시겠습니까?</p>
//       </Modal> */}
//     </div>
//   );
// };

"use client";

import {
  deleteUserData,
  isUserTypeBrand,
} from "@/app/(my-page)/my-page/[id]/actions";
import { IResponse } from "@/model/responses";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Modal from "./my-page-modal";
import { useSession } from "next-auth/react";
import { createChatRoom } from "@/libs/api/chat-room";
import { IUser } from "@/model/user";
import { Timestamp } from "firebase/firestore";

export const ProductSideBar = () => {
  const { data: session, status } = useSession();
  const [isBrandUser, setIsBrandUser] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserType = async (userUid: string) => {
      const isBrand = await isUserTypeBrand(userUid);
      setIsBrandUser(isBrand);
      setLoading(false);
      console.log(userUid);
    };

    if (status === "authenticated" && session?.user?.id) {
      fetchUserType(session.user.id);
    } else {
      setIsBrandUser(false);
      setLoading(false);
    }
  }, [status, session]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleClickOutsideModal = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideModal);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [isModalOpen]);

  const isActive = (path: string) => pathname === path;

  const renderLink = (
    href: string,
    text: string,
    isActiveCondition: boolean
  ) => (
    <Link href={href} legacyBehavior>
      <a
        className={`label-2 py-2 block ${
          isActiveCondition ? "text-primary font-semibold" : "text-gray-600"
        } hover:text-blue-800`}
      >
        {text}
      </a>
    </Link>
  );

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div>
      {/* 햄버거 아이콘 */}
      <div className="absolute lg:hidden text-white font-extrabold  flex justify-end items-end right-0 top-0 mt-[100px]">
        <button onClick={toggleSidebar} className="ml-auto">
          <span className="text-6xl">&#9776;</span>
        </button>
      </div>

      {/* 사이드바 */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } lg:block w-[15rem] border-r border-r-gray-200 flex-col fixed lg:static top-0 left-0 h-full bg-white z-50 lg:z-auto`}
      >
        <div className="flex flex-col pt-40 pl-14 gap-11">
          <div className="h-fit flex flex-col gap-6 flex-nowrap">
            <span className="text-gray-900 heading-2 font-semibold text-lg">
              회원 정보
            </span>
            {renderLink(
              `/my-page/${session.user.id}`,
              "프로필 관리",
              isActive(`/my-page/${session.user.id}`)
            )}
            {isBrandUser &&
              renderLink(
                `/my-page/history/${session.user.id}`,
                "브랜드 신청 이력",
                isActive(`/my-page/history/${session.user.id}`)
              )}
            {renderLink("/add-user", "소속 정하기", isActive("/add-user"))}
            {/* <Link
              href="/add-user"
              className="text-gray-400 label-2 pt-2 cursor-pointer"
            >
              소속 정하기
            </Link> */}
          </div>
          {isBrandUser && (
            <div className="h-fit flex flex-col gap-6 flex-nowrap">
              <span className="text-gray-900 heading-2">상품 관리</span>
              {renderLink(
                `/my-page/product-list`,
                "상품 관리",
                isActive(`/my-page/product-list`)
              )}
            </div>
          )}
        </div>
      </div>

      {/* 모달
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => {}}
        ref={modalRef}
      >
        <p>정말 탈퇴하시겠습니까?</p>
      </Modal> */}
    </div>
  );
};
