// "use client";

// import {
//   deleteUserData,
//   isUserTypeBrand,
// } from "@/app/(my-page)/my-page/[id]/actions";
// import { auth } from "@/config/firebase/firebase";
// import { IResponse } from "@/model/responses";
// import { onAuthStateChanged } from "firebase/auth";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Modal from "./my-page-modal";
// import { useSession } from "next-auth/react";

// const SkeletonSidebar = () => (
//   <div className="w-[15rem] border-r border-r-gray-200 flex-col sticky top-0 left-0 h-screen hidden lg:flex">
//     <div className="flex flex-col pt-40 pl-14 gap-11 animate-pulse">
//       <div className="h-fit flex flex-col gap-6 flex-nowrap">
//         <div className="bg-slate-200 w-32 h-8 rounded-xl"></div>
//         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
//         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
//         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
//       </div>
//       <div className="h-fit flex flex-col gap-6 flex-nowrap">
//         <div className="bg-slate-200 w-32 h-8 rounded-xl"></div>
//         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
//       </div>
//       <div className="h-fit flex flex-col gap-6 flex-nowrap">
//         <div className="bg-slate-200 w-32 h-8 rounded-xl"></div>
//         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
//         <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
//       </div>
//     </div>
//   </div>
// );

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

//   const confirmDeleteUser = async () => {
//     if (session?.user?.id) {
//       const result: IResponse = await deleteUserData(session.user.id);
//       setIsModalOpen(false);

//       alert(result.message);
//       if (result.success) {
//         router.push("/");
//       }
//     }
//   };

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

//   if (loading) {
//     return <SkeletonSidebar />;
//   }

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
//           <span
//             onClick={openModal}
//             className="text-gray-400 label-2 pt-2 cursor-pointer"
//           >
//             탈퇴하기
//           </span>
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
//           <span className="text-gray-900 heading-2">문의</span>
//           <span className="text-gray-400 label-2 pt-2">1:1 문의</span>
//           {renderLink(
//             `/my-page/faq`,
//             "FAQ 자주 묻는 질문",
//             isActive(`/my-page/faq`)
//           )}
//         </div>
//       </div>
//       <Modal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         onConfirm={confirmDeleteUser}
//       >
//         <p>정말 탈퇴하시겠습니까?</p>
//       </Modal>
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
import { useEffect, useState } from "react";
import Modal from "./my-page-modal";
import { useSession } from "next-auth/react";
import { createChatRoom } from "@/libs/api/chat-room";
import { IUser } from "@/model/user";
import { Timestamp } from "firebase/firestore"; // Firestore Timestamp import

const SkeletonSidebar = () => (
  <div className="w-[15rem] border-r border-r-gray-200 flex-col sticky top-0 left-0 h-screen hidden lg:flex">
    <div className="flex flex-col pt-40 pl-14 gap-11 animate-pulse">
      <div className="h-fit flex flex-col gap-6 flex-nowrap">
        <div className="bg-slate-200 w-32 h-8 rounded-xl"></div>
        <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
        <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
        <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
      </div>
      <div className="h-fit flex flex-col gap-6 flex-nowrap">
        <div className="bg-slate-200 w-32 h-8 rounded-xl"></div>
        <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
      </div>
      <div className="h-fit flex flex-col gap-6 flex-nowrap">
        <div className="bg-slate-200 w-32 h-8 rounded-xl"></div>
        <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
        <div className="bg-slate-200 w-24 h-6 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export const ProductSideBar = () => {
  const { data: session, status } = useSession();
  const [isBrandUser, setIsBrandUser] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const router = useRouter();

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

  // const confirmDeleteUser = async () => {
  //   if (session?.user?.id) {
  //     const result: IResponse = await deleteUserData(session.user.id);
  //     setIsModalOpen(false);

  //     alert(result.message);
  //     if (result.success) {
  //       router.push("/");
  //     }
  //   }
  // };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isActive = (path: string) => pathname === path;

  const renderLink = (
    href: string,
    text: string,
    isActiveCondition: boolean
  ) => (
    <Link href={href} legacyBehavior>
      <a
        className={`label-2 pt-2 ${
          isActiveCondition ? "text-primary font-bold" : "text-gray-400"
        }`}
      >
        {text}
      </a>
    </Link>
  );

  // 1:1 문의 시 채팅방 생성 및 이동
  // 이부분 다시 체크해봐야함 firebase db에 잘 쌓이고 메시지로 들어가면 채팅방이 생겨져 있으나 라우트가 404뜸
  const handleDirectInquiry = async () => {
    const adminUser: IUser = {
      id: "admin-id",
      name: "스포너 관리자",
      profileImage: "/path/to/admin/profileImage.png",
      email: "admin@example.com",
      address: "Admin Address",
      phoneNumber: "010-0000-0000",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userType: "admin",
    };

    if (session?.user) {
      const user: IUser = {
        id: session.user.id,
        name: session.user.name || session.user.email,
        profileImage: session.user.image || "/default/path/to/profile.png",
        email: session.user.email || "",
        address: "",
        phoneNumber: "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        userType: "user",
      };

      const chatRoomResponse = await createChatRoom(adminUser, user, "");
      console.log("Chat Room Response: ", chatRoomResponse);

      if (chatRoomResponse.success) {
        // Use Link component with session.user.id and chatRoomResponse.data
        router.push(`/chats/${session.user.id}`);
      } else {
        alert("채팅방 생성에 실패했습니다.");
      }
    }
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="w-[15rem] border-r border-r-gray-200 flex-col sticky top-0 left-0 h-screen hidden lg:flex">
      <div className="flex flex-col pt-40 pl-14 gap-11">
        <div className="h-fit flex flex-col gap-6 flex-nowrap">
          <span className="text-gray-900 heading-2">회원 정보</span>
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
          <Link
            href="/add-user"
            className="text-gray-400 label-2 pt-2 cursor-pointer"
          >
            소속 정하기
          </Link>
          {/* <span
            onClick={openModal}
            className="text-gray-400 label-2 pt-2 cursor-pointer"
          >
            탈퇴하기
          </span> */}
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
        <div className="h-fit flex flex-col gap-6 flex-nowrap">
          <span className="text-gray-900 heading-2">문의</span>
          <span
            onClick={handleDirectInquiry}
            className="text-gray-400 label-2 pt-2 cursor-pointer"
          >
            1:1 문의
          </span>
          {renderLink(
            `/my-page/faq`,
            "FAQ 자주 묻는 질문",
            isActive(`/my-page/faq`)
          )}
        </div>
      </div>
      {/* <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDeleteUser}
      >
        <p>정말 탈퇴하시겠습니까?</p>
      </Modal> */}
    </div>
  );
};
