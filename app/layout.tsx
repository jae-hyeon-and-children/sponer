import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import RecoilWrapper from "@/recoil/recoil-wrapper";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";

const suit = localFont({
  src: "./fonts/SUIT-Variable.woff2",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={suit.className}>
        <Header />
        <RecoilWrapper>{children}</RecoilWrapper>
        <Footer />
      </body>
    </html>
  );
}
