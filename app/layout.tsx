"use client";

import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import RecoilWrapper from "@/recoil/recoil-wrapper";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";
import Toast from "@/components/global/toast";
import { usePathname } from "next/navigation";
import AuthProvider from "@/components/(auth)/AuthProvider";

const suit = localFont({
	src: "./fonts/SUIT-Variable.woff2",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();

	if (pathname.startsWith("/chats")) {
		return (
			<html lang="en">
				<body className={suit.className}>
					<AuthProvider>
						<Header />
						<RecoilWrapper>{children}</RecoilWrapper>
					</AuthProvider>
				</body>
			</html>
		);
	}

	return (
		<html lang="en">
			<body className={suit.className}>
				<AuthProvider>
					<Header />
					<RecoilWrapper>
						{children}
						<Toast />
					</RecoilWrapper>
				</AuthProvider>
				<Footer />
			</body>
		</html>
	);
}
