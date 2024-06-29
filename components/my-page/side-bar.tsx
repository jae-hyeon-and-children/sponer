"use client";

import {
	deleteUserData,
	isUserTypeBrand,
} from "@/app/(my-page)/my-page/[id]/actions";
import { auth } from "@/config/firebase/firebase";
import useAuth from "@/libs/auth";
import { IResponse } from "@/model/responses";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "./my-page-modal";

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
	const userAuth = useAuth();
	const [isBrandUser, setIsBrandUser] = useState<boolean | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		const fetchUserType = async (userAuth: any) => {
			const isBrand = await isUserTypeBrand(userAuth.uid);
			setIsBrandUser(isBrand);
			setLoading(false);
			console.log(userAuth.uid);
		};

		const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
			if (userAuth) {
				fetchUserType(userAuth);
			} else {
				setIsBrandUser(false);
				setLoading(false);
			}
		});

		return () => unsubscribe();
	}, []);

	const confirmDeleteUser = async () => {
		if (userAuth) {
			const result: IResponse = await deleteUserData(userAuth.uid);
			setIsModalOpen(false);

			alert(result.message);
			if (result.success) {
				router.push("/");
			}
		}
	};

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

	if (loading) {
		return <SkeletonSidebar />;
	}

	return (
		<div className="w-[15rem] border-r border-r-gray-200 flex-col sticky top-0 left-0 h-screen hidden lg:flex">
			<div className="flex flex-col pt-40 pl-14 gap-11">
				<div className="h-fit flex flex-col gap-6 flex-nowrap">
					<span className="text-gray-900 heading-2">회원 정보</span>
					{renderLink(
						`/my-page/${userAuth!.uid}`,
						"프로필 관리",
						isActive(`/my-page/${userAuth!.uid}`)
					)}
					{isBrandUser &&
						renderLink(
							`/my-page/history/${userAuth!.uid}`,
							"브랜드 신청 이력",
							isActive(`/my-page/history/${userAuth!.uid}`)
						)}
					<span
						onClick={openModal}
						className="text-gray-400 label-2 pt-2 cursor-pointer"
					>
						탈퇴하기
					</span>
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
					<span className="text-gray-400 label-2 pt-2">1:1 문의</span>
					{renderLink(
						`/my-page/faq`,
						"FAQ 자주 묻는 질문",
						isActive(`/my-page/faq`)
					)}
				</div>
			</div>
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onConfirm={confirmDeleteUser}
			>
				<p>정말 탈퇴하시겠습니까?</p>
			</Modal>
		</div>
	);
};
