"use client";

import { isUserTypeBrand } from "@/app/(my-page)/my-page/[id]/actions";
import { auth } from "@/config/firebase/firebase";
import useAuth from "@/libs/auth";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SideBarProps {
	id?: string;
}

export const ProductSideBar = () => {
	const userAuth = useAuth();
	const [isBrandUser, setIsBrandUser] = useState<boolean | null>(null);
	const pathname = usePathname();

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

	if (isBrandUser === null || userAuth === null) {
		return <div>Loading...</div>;
	}

	const isActive = (path: string) => pathname === path;

	return (
		<div className="w-[15rem] border-r border-r-gray-200 flex flex-col sticky top-0 left-0 h-screen">
			<div className="flex flex-col pt-40 pl-14 gap-11">
				<div className="h-fit flex flex-col gap-6">
					<span className="text-gray-900 heading-2">회원 정보</span>
					<Link href={`/my-page/${userAuth.uid}`} legacyBehavior>
						<a
							className={`text-gray-400 label-2 pt-2 ${
								isActive(`/my-page/${userAuth.uid}`)
									? "text-blue-500 font-bold"
									: ""
							}`}
						>
							프로필 관리
						</a>
					</Link>
					<span className="text-gray-400 label-2 pt-2">탈퇴하기</span>
				</div>
				{isBrandUser && (
					<div className="h-fit flex flex-col gap-6">
						<span className="text-gray-900 heading-2">상품 관리</span>
						<Link href={`/my-page/product-list/${userAuth.uid}`} legacyBehavior>
							<a
								className={`text-gray-400 label-2 pt-2 ${
									isActive(`/my-page/product-list`)
										? "text-blue-500 font-bold"
										: ""
								}`}
							>
								상품 관리
							</a>
						</Link>
					</div>
				)}
				<div className="h-fit flex flex-col gap-6">
					<span className="text-gray-900 heading-2">문의</span>
					<span className="text-gray-400 label-2 pt-2">1:1 문의</span>
					<Link href={`/my-page/faq`} legacyBehavior>
						<a
							className={`text-gray-400 label-2 ${
								isActive(`/my-page/faq`) ? "text-blue-500 font-bold" : ""
							}`}
						>
							FAQ 자주 묻는 질문
						</a>
					</Link>
				</div>
			</div>
		</div>
	);
};
