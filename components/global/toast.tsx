"use client";

import { useRecoilState } from "recoil";
import { toastState } from "@/recoil/atoms";
import { useEffect } from "react";

export default function Toast() {
  const [toast, setToast] = useRecoilState(toastState);

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        setToast({
          isVisible: false,
          message: "",
          type: "error",
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast.isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg ${
        toast.type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {toast.message}
    </div>
  );
}
