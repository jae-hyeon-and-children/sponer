"use client";

import { ReactNode } from "react";
import { RecoilRoot } from "recoil";

type RecoilWrapperProps = {
  children: ReactNode;
};

export default function RecoilWrapper({ children }: RecoilWrapperProps) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
