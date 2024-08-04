// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyA95Ob1M86Gnqm5z6ac-SH1sAkYx2rcW1Y",
  authDomain: "sponer-57720.firebaseapp.com",
  projectId: "sponer-57720",
  storageBucket: "sponer-57720.appspot.com",
  messagingSenderId: "543514702634",
  appId: "1:543514702634:web:4b625b9bc6a74ae3212453",
  measurementId: "G-V9JCZP5PH8",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT") {
    const { firebaseConfig } = event.data;
    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function (payload) {
      console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
      );
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "sponer_Logo.png",
        sound: "default",
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });
  }
});
