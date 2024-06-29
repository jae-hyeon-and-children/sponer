"use server";

import { sign } from "jsonwebtoken";
import { IResponse } from "@/model/responses";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function loginHandler(uid: string): Promise<IResponse> {
  if (!uid) {
    return {
      status: 400,
      success: false,
      message: "유효한 사용자 ID가 필요합니다.",
    };
  }

  try {
    const token = sign({ uid }, JWT_SECRET, { expiresIn: "1h" });

    return {
      status: 200,
      success: true,
      message: "성공적으로 로그인되었습니다.",
      token,
    };
  } catch (error) {
    console.error("토큰 발급 오류:", error);
    return {
      status: 500,
      success: false,
      message: "토큰 발급 중 오류가 발생했습니다.",
    };
  }
}
