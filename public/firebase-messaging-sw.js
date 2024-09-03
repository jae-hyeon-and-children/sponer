// // public/firebase-messaging-sw.js
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
// );

// const firebaseConfig = {
//   apiKey: "AIzaSyA95Ob1M86Gnqm5z6ac-SH1sAkYx2rcW1Y",
//   authDomain: "sponer-57720.firebaseapp.com",
//   projectId: "sponer-57720",
//   storageBucket: "sponer-57720.appspot.com",
//   messagingSenderId: "543514702634",
//   appId: "1:543514702634:web:4b625b9bc6a74ae3212453",
//   measurementId: "G-V9JCZP5PH8",
// };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();
// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "INIT") {
//     const { firebaseConfig } = event.data;
//     firebase.initializeApp(firebaseConfig);

//     const messaging = firebase.messaging();

//     messaging.onBackgroundMessage(function (payload) {
//       console.log(
//         "[firebase-messaging-sw.js] Received background message ",
//         payload
//       );
//       const link = payload.fcmOptions?.link || payload.data?.link;
//       const notificationTitle = payload.notification.title;
//       const notificationOptions = {
//         body: payload.notification.body,
//         icon: "sponer_Logo.png",
//         sound: "default",
//         data: { url: link },
//       };

//       self.registration.showNotification(
//         notificationTitle,
//         notificationOptions
//       );
//     });

//     self.addEventListener("notificationclick", function (event) {
//       console.log("[firebase-messaging-sw.js] Notification clock received. ");

//       event.notification.close();
//     });
//   }
// });

// public/firebase-messaging-sw.js
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
// );

// const firebaseConfig = {
//   apiKey: "AIzaSyA95Ob1M86Gnqm5z6ac-SH1sAkYx2rcW1Y",
//   authDomain: "sponer-57720.firebaseapp.com",
//   projectId: "sponer-57720",
//   storageBucket: "sponer-57720.appspot.com",
//   messagingSenderId: "543514702634",
//   appId: "1:543514702634:web:4b625b9bc6a74ae3212453",
//   measurementId: "G-V9JCZP5PH8",
// };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // const link = payload.fcmOptions?.link || payload.data?.link
//   const notificationTitle = payload.notification.title || "No Title";
//   const notificationOptions = {
//     body: payload.notification.body || "No Body",
//     icon: payload.notification.icon || "sponer_Logo.png",
//     sound: "default",
//     data: { url: payload.data?.link || "/" },
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener("notificationclick", function (event) {
//   console.log("[firebase-messaging-sw.js] Notification click received.");
//   const url = event.notification.data.url;
//   event.notification.close();
//   event.waitUntil(clients.openWindow(url));
// });

// Import the required scripts for Firebase
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
);

// Initialize Firebase
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

// Listen for background messages
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title || "No Title";
  const notificationOptions = {
    body: payload.notification.body || "No Body",
    icon: payload.notification.icon || "sponer_Logo.png",
    sound: "default",
    data: { url: payload.data?.link || "/" },
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Listen for notification clicks
self.addEventListener("notificationclick", function (event) {
  console.log("[firebase-messaging-sw.js] Notification click received.");
  const url = event.notification.data.url;
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});

// Add a fetch event listener to the service worker
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetch event:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
