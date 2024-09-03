import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "@/config/firebase/firebase";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface DecodedToken {
  uid: string;
}

export async function POST(req: NextRequest) {
  const { token, productId } = await req.json();

  if (!token) {
    return NextResponse.json({ message: "토큰이 없습니다" }, { status: 401 });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as DecodedToken;
    const uid = decoded.uid;

    // Firestore에서 product의 brandId를 가져옵니다.
    const productDocRef = doc(fireStore, "Product", productId);
    const productDocSnap = await getDoc(productDocRef);

    if (!productDocSnap.exists()) {
      return NextResponse.json(
        { message: "유효하지 않은 상품입니다" },
        { status: 401 }
      );
    }

    const brandId = productDocSnap.data()?.brandId;

    if (uid !== brandId) {
      return NextResponse.json({ message: "권한이 없습니다" }, { status: 403 });
    }

    return NextResponse.json({ message: "접근 가능" }, { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
