import admin from "firebase-admin";

// 이미 초기화된 경우 새로 초기화하지 않음
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
    ),
  });
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
