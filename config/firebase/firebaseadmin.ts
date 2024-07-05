import admin from "firebase-admin";

if (!admin.apps.length) {
  console.log("Firebase Admin SDK 초기화 시작");
  console.log(
    "FIREBASE_SERVICE_ACCOUNT_KEY:",
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  );

  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });

  console.log("Firebase Admin SDK 초기화 완료");
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
