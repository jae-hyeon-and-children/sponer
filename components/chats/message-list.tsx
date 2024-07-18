// import Message from "./message";

// import { auth, fireStore } from "@/config/firebase/firebase";
// import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";
// import { timeStampToDate } from "@/libs/utils/date";
// import { IMessage, MessageConverter } from "@/model/message";
// import {
//   COLLECTION_NAME_CHAT,
//   COLLECTION_NAME_MESSAGE,
// } from "@/constants/variables";
// import { useRecoilValue } from "recoil";
// import { chatRoomIdState } from "@/recoil/atoms";

// export default function MessageList() {
//   const [uid, setUid] = useState<string | null>(null);
//   const chatRoomId = useRecoilValue(chatRoomIdState);
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     auth.onAuthStateChanged((currentUser) => {
//       currentUser ? setUid(currentUser.uid) : setUid(null);
//     });
//     const unSubscribe = onSnapshot(
//       query(
//         collection(
//           fireStore,
//           `${COLLECTION_NAME_CHAT}/${chatRoomId}/${COLLECTION_NAME_MESSAGE}`
//         ),
//         orderBy("createdAt")
//       ),
//       (snapshot) => {
//         const convertedMessages = snapshot.docs.map((message) =>
//           MessageConverter.fromFirestore(message)
//         );
//         setMessages(convertedMessages);
//       }
//     );

//     return () => unSubscribe();
//   }, [chatRoomId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (
//     <ul className="px-6 py-4 flex-1 flex flex-col gap-5 justify-end ">
//       {messages.map((value, index) => (
//         <Message
//           key={index}
//           content={value.content}
//           contentType={value.contentType}
//           createdAt={timeStampToDate(value.createdAt)}
//           senderId={value.senderId}
//           userId={uid!}
//         />
//       ))}
//       <div ref={messagesEndRef} />
//     </ul>
//   );
// }

"use client";

import Message from "./message";
import { fireStore } from "@/config/firebase/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { timeStampToDate } from "@/libs/utils/date";
import { IMessage, MessageConverter } from "@/model/message";
import {
  COLLECTION_NAME_CHAT,
  COLLECTION_NAME_MESSAGE,
} from "@/constants/variables";
import { useRecoilValue } from "recoil";
import { chatRoomIdState } from "@/recoil/atoms";
import { useSession } from "next-auth/react";

export default function MessageList() {
  const { data: session } = useSession();
  const uid = session?.user?.id as string;
  const chatRoomId = useRecoilValue(chatRoomIdState);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRoomId) return;

    const q = query(
      collection(
        fireStore,
        `${COLLECTION_NAME_CHAT}/${chatRoomId}/${COLLECTION_NAME_MESSAGE}`
      ),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedMessages: IMessage[] = [];
      const unreadMessages: IMessage[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as IMessage;
        fetchedMessages.push({ id: doc.id, ...data });
        if (data.senderId !== uid && !data.readBy?.includes(uid)) {
          unreadMessages.push({ id: doc.id, ...data });
        }
      });
      setMessages(fetchedMessages);

      if (unreadMessages.length > 0) {
        const batch = writeBatch(fireStore);
        unreadMessages.forEach((message) => {
          const messageDocRef = doc(
            fireStore,
            `${COLLECTION_NAME_CHAT}/${chatRoomId}/${COLLECTION_NAME_MESSAGE}`,
            message.id!
          );
          batch.update(messageDocRef, {
            readBy: [...(message.readBy || []), uid],
          });
        });
        await batch.commit();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [chatRoomId, uid]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ul className="px-6 py-4 flex-1 flex flex-col gap-5 justify-end ">
      {messages.map((value) => (
        <Message
          key={value.id}
          id={value.id}
          content={value.content}
          contentType={value.contentType}
          createdAt={timeStampToDate(value.createdAt)}
          senderId={value.senderId}
          userId={uid!}
          readBy={value.readBy}
        />
      ))}
      <div ref={messagesEndRef} />
    </ul>
  );
}
