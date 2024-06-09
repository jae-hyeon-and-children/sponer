"use client";

import Link from "next/link";

import Input from "@/components/global/input";

import Footer from "@/components/global/footer";
import Image from "next/image";
import Header from "../components/global/header";
import Products from "./products/page";

export default function Home() {
  return (
    <main>
      <Products />
    </main>
  );
}
