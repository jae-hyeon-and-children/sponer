import Header from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "sponer | chat",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
