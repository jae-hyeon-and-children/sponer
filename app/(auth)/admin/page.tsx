"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { isUserTypeAdmin } from "./actions";
import ProductsSection from "./components/products-Section";
import MessagesSection from "./components/messages-Section";
import ApprovalsSection from "./components/approvals-Section";
import UsersSection from "./components/users-Section";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    const checkAdmin = async () => {
      if (status === "loading") return;

      if (session?.user?.id) {
        const isAdmin = await isUserTypeAdmin(session.user.id);

        if (!isAdmin) {
          router.push("/");
          return;
        }
        setIsLoading(false);
      } else {
        router.push("/login");
      }
    };

    checkAdmin();
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // 각 탭에 대한 컴포넌트
  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductsSection />;
      case "messages":
        return <MessagesSection />;
      case "approvals":
        return <ApprovalsSection />;
      case "users":
        return <UsersSection />;
      default:
        return <ProductsSection />;
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col mt-[72px]">
      <header className="bg-primary shadow-sm fixed top-0 left-0 right-0 z-10 mt-[72px]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">관리자 대시보드</h1>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-white hover:text-gray-700"
          >
            홈으로 가기
          </button>
        </div>
      </header>

      <div className="flex flex-grow mt-16">
        {/* 사이드바 */}
        <aside className="w-64 bg-white shadow-md p-4">
          <nav className="space-y-4">
            <button
              className={`w-full text-left p-2 ${
                activeTab === "products" ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("products")}
            >
              제품 목록
            </button>
            <button
              className={`w-full text-left p-2 ${
                activeTab === "messages" ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("messages")}
            >
              메시지 목록
            </button>
            <button
              className={`w-full text-left p-2 ${
                activeTab === "approvals" ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("approvals")}
            >
              브랜드사업자 승인
            </button>
            <button
              className={`w-full text-left p-2 ${
                activeTab === "users" ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              사용자 목록
            </button>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-grow p-6 bg-gray-50">{renderContent()}</main>
      </div>

      <footer className="bg-gray-100 py-4">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} 관리자 대시보드. 모든 권리 보유.
        </div>
      </footer>
    </div>
  );
}
