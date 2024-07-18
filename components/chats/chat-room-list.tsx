// "use client";

// import ChatRoom from "@/components/chats/chat-room";

// import { auth, fireStore } from "@/config/firebase/firebase";
// import { COLLECTION_NAME_CHAT } from "@/constants/variables";
// import { getProduct } from "@/libs/api/product";
// import useAuth from "@/libs/hook/useAuth";
// import { timeStampToDate } from "@/libs/utils/date";
// import { ChatRoomConverter, IChatRoom } from "@/model/chat-room";
// import {
//   chatRoomIdState,
//   chatRoomProductState,
//   chatRoomUserState,
// } from "@/recoil/atoms";
// import {
//   collection,
//   onSnapshot,
//   orderBy,
//   query,
//   where,
// } from "firebase/firestore";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";

// export default function ChatRoomList() {
//   const [uid, setUid] = useState<string | null>(null);
//   const chatRoomId = useRecoilValue(chatRoomIdState);
//   const setChatRoomUser = useSetRecoilState(chatRoomUserState);
//   const setChatRoomProduct = useSetRecoilState(chatRoomProductState);
//   const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);
//   const router = useRouter();

//   const getOtherUser = (chatRoom: IChatRoom) =>
//     chatRoom.users.find((user) => user.id !== uid);

//   useEffect(() => {
//     auth.onAuthStateChanged((currentUser) => {
//       console.log(currentUser);
//       currentUser ? setUid(currentUser.uid) : setUid(null);

//       if (!currentUser) {
//         router.push(`/login`);
//         return;
//       } else {
//         const unSubscribeChatRooms = onSnapshot(
//           query(
//             collection(fireStore, COLLECTION_NAME_CHAT),
//             where("userIds", "array-contains", uid),
//             orderBy("updatedAt", "desc")
//           ),
//           (snapshot) => {
//             const convertedChatRooms = snapshot.docs.map((chatRoom) =>
//               ChatRoomConverter.fromFirestore(chatRoom)
//             );

//             let selectedChatRoom = convertedChatRooms.find(
//               (chatRoom) => chatRoom.id == chatRoomId
//             );

//             if (selectedChatRoom === undefined && convertedChatRooms[0]) {
//               router.push(`/chats/${convertedChatRooms[0].id}`);
//             }

//             if (selectedChatRoom) {
//               const otherUser = getOtherUser(selectedChatRoom);
//               setChatRoomUser(otherUser!);

//               const fetchProduct = async () => {
//                 if (selectedChatRoom.productId) {
//                   const res = await getProduct(selectedChatRoom.productId);
//                   if (res.status === 404) setChatRoomProduct(null);
//                   setChatRoomProduct(res.data ?? null);
//                 }
//               };

//               fetchProduct();
//             }
//             setChatRooms(convertedChatRooms);
//           }
//         );
//         return () => {
//           unSubscribeChatRooms();
//         };
//       }
//     });
//   }, [chatRoomId, router, setChatRoomProduct, setChatRoomUser, uid]);

//   return (
//     <ul className="flex flex-col gap-4">
//       {chatRooms.map((value, index) => {
//         const otherUser = getOtherUser(value);
//         return (
//           <Link key={index} href={`/chats/${value.id}`}>
//             <ChatRoom
//               imageUrl={otherUser!.profileImage}
//               name={otherUser!.name}
//               message={value.lastMessage}
//               sentDate={timeStampToDate(value.updatedAt)}
//               isSelected={value.id === chatRoomId}
//             />
//           </Link>
//         );
//       })}
//     </ul>
//   );
// }

// "use client";

// import ChatRoom from "@/components/chats/chat-room";
// import { fireStore } from "@/config/firebase/firebase";
// import {
//   COLLECTION_NAME_CHAT,
//   COLLECTION_NAME_MESSAGE,
// } from "@/constants/variables";
// import { getProduct } from "@/libs/api/product";
// import { timeStampToDate } from "@/libs/utils/date";
// import { ChatRoomConverter, IChatRoom } from "@/model/chat-room";
// import {
//   chatRoomIdState,
//   chatRoomProductState,
//   chatRoomUserState,
//   unreadCountState,
// } from "@/recoil/atoms";
// import {
//   collection,
//   onSnapshot,
//   orderBy,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
// import { useSession } from "next-auth/react";
// import { IMessage } from "@/model/message";

// export default function ChatRoomList() {
//   const { data: session, status } = useSession();
//   const chatRoomId = useRecoilValue(chatRoomIdState);
//   const setChatRoomUser = useSetRecoilState(chatRoomUserState);
//   const setChatRoomProduct = useSetRecoilState(chatRoomProductState);
//   const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);
//   const [unreadCounts, setUnreadCounts] = useRecoilState(unreadCountState);
//   const router = useRouter();
//   const uid = session?.user?.id;

//   const getOtherUser = (chatRoom: IChatRoom) =>
//     chatRoom.users.find((user) => user.id !== uid);

//   useEffect(() => {
//     if (status === "authenticated" && uid) {
//       const unSubscribeChatRooms = onSnapshot(
//         query(
//           collection(fireStore, COLLECTION_NAME_CHAT),
//           where("userIds", "array-contains", uid),
//           orderBy("updatedAt", "desc")
//         ),
//         async (snapshot) => {
//           const convertedChatRooms = snapshot.docs.map((chatRoom) =>
//             ChatRoomConverter.fromFirestore(chatRoom)
//           );

//           let selectedChatRoom = convertedChatRooms.find(
//             (chatRoom) => chatRoom.id == chatRoomId
//           );

//           if (selectedChatRoom === undefined && convertedChatRooms[0]) {
//             router.push(`/chats/${convertedChatRooms[0].id}`);
//           }

//           if (selectedChatRoom) {
//             const otherUser = getOtherUser(selectedChatRoom);
//             setChatRoomUser(otherUser!);

//             const fetchProduct = async () => {
//               if (selectedChatRoom.productId) {
//                 const res = await getProduct(selectedChatRoom.productId);
//                 if (res.status === 404) setChatRoomProduct(null);
//                 setChatRoomProduct(res.data ?? null);
//               }
//             };

//             fetchProduct();
//           }
//           setChatRooms(convertedChatRooms);

//           // Unread message counts
//           const counts: { [key: string]: number } = {};
//           for (const chatRoom of convertedChatRooms) {
//             const messagesSnapshot = await getDocs(
//               collection(
//                 fireStore,
//                 `${COLLECTION_NAME_CHAT}/${chatRoom.id}/${COLLECTION_NAME_MESSAGE}`
//               )
//             );
//             counts[chatRoom.id!] = messagesSnapshot.docs.filter((doc) => {
//               const data = doc.data() as IMessage;
//               if (!Array.isArray(data.readBy)) {
//                 data.readBy = [];
//               }
//               return data.senderId !== uid && !data.readBy.includes(uid);
//             }).length;
//           }
//           setUnreadCounts(counts);
//         }
//       );
//       return () => {
//         unSubscribeChatRooms();
//       };
//     } else {
//       router.push("/login");
//     }
//   }, [chatRoomId, router, setChatRoomProduct, setChatRoomUser, uid, status]);

//   return (
//     <ul className="flex flex-col gap-4 ">
//       {chatRooms.map((value, index) => {
//         const otherUser = getOtherUser(value);
//         return (
//           <Link key={index} href={`/chats/${value.id}`}>
//             <ChatRoom
//               imageUrl={otherUser!.profileImage}
//               name={otherUser!.name}
//               message={value.lastMessage}
//               sentDate={timeStampToDate(value.updatedAt)}
//               isSelected={value.id === chatRoomId}
//               unreadCount={unreadCounts[value.id!] || 0}
//             />
//           </Link>
//         );
//       })}
//     </ul>
//   );
// }

"use client";

import ChatRoom from "@/components/chats/chat-room";
import { fireStore } from "@/config/firebase/firebase";
import {
  COLLECTION_NAME_CHAT,
  COLLECTION_NAME_MESSAGE,
} from "@/constants/variables";
import { getProduct } from "@/libs/api/product";
import { timeStampToDate } from "@/libs/utils/date";
import { ChatRoomConverter, IChatRoom } from "@/model/chat-room";
import {
  chatRoomIdState,
  chatRoomProductState,
  chatRoomUserState,
  unreadCountState,
} from "@/recoil/atoms";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import { IMessage } from "@/model/message";

export default function ChatRoomList() {
  const { data: session, status } = useSession();
  const chatRoomId = useRecoilValue(chatRoomIdState);
  const setChatRoomUser = useSetRecoilState(chatRoomUserState);
  const setChatRoomProduct = useSetRecoilState(chatRoomProductState);
  const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);
  const [unreadCounts, setUnreadCounts] = useRecoilState(unreadCountState);
  const router = useRouter();
  const uid = session?.user?.id;

  const getOtherUser = (chatRoom: IChatRoom) =>
    chatRoom.users.find((user) => user.id !== uid);

  useEffect(() => {
    if (status === "authenticated" && uid) {
      const unSubscribeChatRooms = onSnapshot(
        query(
          collection(fireStore, COLLECTION_NAME_CHAT),
          where("userIds", "array-contains", uid),
          orderBy("updatedAt", "desc")
        ),
        async (snapshot) => {
          const convertedChatRooms = snapshot.docs.map((chatRoom) =>
            ChatRoomConverter.fromFirestore(chatRoom)
          );

          let selectedChatRoom = convertedChatRooms.find(
            (chatRoom) => chatRoom.id == chatRoomId
          );

          if (selectedChatRoom === undefined && convertedChatRooms[0]) {
            router.push(`/chats/${convertedChatRooms[0].id}`);
          }

          if (selectedChatRoom) {
            const otherUser = getOtherUser(selectedChatRoom);
            setChatRoomUser(otherUser!);

            const fetchProduct = async () => {
              if (selectedChatRoom.productId) {
                const res = await getProduct(selectedChatRoom.productId);
                if (res.status === 404) setChatRoomProduct(null);
                setChatRoomProduct(res.data ?? null);
              }
            };

            fetchProduct();
          }
          setChatRooms(convertedChatRooms);

          // Unread message counts
          const counts: { [key: string]: number } = {};
          const unreadPromises = convertedChatRooms.map(async (chatRoom) => {
            if (chatRoom.id) {
              const messagesSnapshot = await getDocs(
                collection(
                  fireStore,
                  `${COLLECTION_NAME_CHAT}/${chatRoom.id}/${COLLECTION_NAME_MESSAGE}`
                )
              );
              counts[chatRoom.id] = messagesSnapshot.docs.filter((doc) => {
                const data = doc.data() as IMessage;
                if (!Array.isArray(data.readBy)) {
                  data.readBy = [];
                }
                return data.senderId !== uid && !data.readBy.includes(uid);
              }).length;
            }
          });

          await Promise.all(unreadPromises);
          setUnreadCounts(counts);
        }
      );
      return () => {
        unSubscribeChatRooms();
      };
    } else {
      router.push("/login");
    }
    // window.scrollTo(0, 0);
  }, [chatRoomId, router, setChatRoomProduct, setChatRoomUser, uid, status]);

  return (
    <ul className="flex flex-col gap-4 ">
      {chatRooms.map((value, index) => {
        const otherUser = getOtherUser(value);
        return (
          <Link key={index} href={`/chats/${value.id}`}>
            <ChatRoom
              imageUrl={otherUser!.profileImage}
              name={otherUser!.name}
              message={value.lastMessage}
              sentDate={timeStampToDate(value.updatedAt)}
              isSelected={value.id === chatRoomId}
              unreadCount={unreadCounts[value.id!] || 0}
            />
          </Link>
        );
      })}
    </ul>
  );
}
