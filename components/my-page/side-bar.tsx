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

export const ProductSideBar = () => {
	const userAuth = useAuth();
	const [isBrandUser, setIsBrandUser] = useState<boolean | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
			if (userAuth) {
				const isBrand = await isUserTypeBrand(userAuth.uid);
				setIsBrandUser(isBrand);
				console.log(userAuth.uid);
			} else {
				setIsBrandUser(false);
			}
		});

		return () => unsubscribe();
	}, []);

	const confirmDeleteUser = async () => {
		if (userAuth) {
			const result: IResponse = await deleteUserData(userAuth.uid);
			setIsModalOpen(false);

			if (result.success) {
				alert(result.message);
				router.push("/");
			} else {
				alert(result.message);
			}
		}
	};

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	if (isBrandUser === null || userAuth === null) {
		return null;
	}

	const isActive = (path: string) => {
		console.log(pathname, path);
		console.log(pathname === path);
		return pathname === path;
	};

	return (
		<div className="w-[15rem] border-r border-r-gray-200  flex-col sticky top-0 left-0 h-screen hidden lg:flex">
			<div className="flex flex-col pt-40 pl-14 gap-11">
				<div className="h-fit flex flex-col gap-6  flex-nowrap">
					<span className="text-gray-900 heading-2">회원 정보</span>
					<Link href={`/my-page/${userAuth.uid}`} legacyBehavior>
						<a
							className={`label-2 pt-2 ${
								isActive(`/my-page/${userAuth.uid}`)
									? "text-primary font-bold"
									: "text-gray-400"
							}`}
						>
							프로필 관리
						</a>
					</Link>
					{isBrandUser && (
						<Link
							href={`/my-page/history/${userAuth.uid}`}
							className="text-gray-400 label-2 pt-2 cursor-pointer"
						>
							브랜드 신청 이력
						</Link>
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
						<Link href={`/my-page/product-list`} legacyBehavior>
							<a
								className={` label-2 pt-2 ${
									isActive(`/my-page/product-list`)
										? "text-primary font-bold"
										: "text-gray-400"
								}`}
							>
								상품 관리
							</a>
						</Link>
					</div>
				)}
				<div className="h-fit flex flex-col gap-6 flex-nowrap">
					<span className="text-gray-900 heading-2">문의</span>
					<span className="text-gray-400 label-2 pt-2">1:1 문의</span>
					<Link href={`/my-page/faq`} legacyBehavior>
						<a
							className={`label-2 pt-2 ${
								isActive(`/my-page/faq`)
									? "text-primary font-bold"
									: "text-gray-400"
							}`}
						>
							FAQ 자주 묻는 질문
						</a>
					</Link>
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
