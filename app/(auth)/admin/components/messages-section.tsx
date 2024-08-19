// "use client";

// export default function MessagesSection() {
//   return (
//     <section className="bg-white rounded-lg shadow p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">메시지 목록</h2>
//       <p>여기에 메시지 목록이 표시됩니다.</p>
//       {/* 이곳에 메시지 목록을 표시하는 로직을 추가합니다. */}
//     </section>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { fireStore } from "@/config/firebase/firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";

// 메시지 타입 정의
type Message = {
  id: string;
  createdAt: Timestamp;
  lastMessage: string;
  productId: string;
  updatedAt: Timestamp;
  users: Array<{
    id: string;
    name: string;
  }>;
};

type SubMessage = {
  id: string;
  content: string;
  contentType: string;
  createdAt: Timestamp;
  senderId: string;
};

// 모든 메시지를 가져오는 함수
async function fetchAllMessages(): Promise<Message[]> {
  const messagesCollection = collection(fireStore, "Chat");
  const messagesSnapshot = await getDocs(messagesCollection);
  const messagesList = messagesSnapshot.docs.map((doc) => {
    const data = doc.data() as Message;
    return {
      ...data,
      id: doc.id, // 문서의 ID를 메시지의 ID로 사용
    };
  });
  return messagesList;
}

// 메시지 목록을 표시하는 컴포넌트
export default function MessagesSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(
    null
  );
  const [subMessages, setSubMessages] = useState<Record<string, SubMessage[]>>(
    {}
  );

  useEffect(() => {
    const getMessages = async () => {
      const fetchedMessages: Message[] = await fetchAllMessages();
      setMessages(fetchedMessages);
      setLoading(false);
    };

    getMessages();
  }, []);

  const toggleExpand = async (messageId: string) => {
    if (expandedMessageId === messageId) {
      // 이미 펼쳐진 메시지를 클릭한 경우 접기
      setExpandedMessageId(null);
    } else {
      // 새로운 메시지를 펼치기
      setExpandedMessageId(messageId);

      // 하위 메시지 가져오기 (이미 가져온 적이 없다면)
      if (!subMessages[messageId]) {
        const subMessagesCollection = collection(
          fireStore,
          `Chat/${messageId}/Message`
        );
        const subMessagesSnapshot = await getDocs(subMessagesCollection);
        const subMessagesList = subMessagesSnapshot.docs.map((subDoc) => ({
          id: subDoc.id,
          ...subDoc.data(),
        })) as SubMessage[];
        setSubMessages((prevState) => ({
          ...prevState,
          [messageId]: subMessagesList,
        }));
      }
    }
  };

  if (loading) {
    return <div className="text-center">메시지 목록을 불러오는 중...</div>;
  }

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">메시지 목록</h2>
      <ul className="space-y-4">
        {messages.map((message) => (
          <li
            key={message.id}
            className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 ease-in-out"
          >
            <div
              onClick={() => toggleExpand(message.id)}
              className="cursor-pointer"
            >
              <p className="text-lg font-bold">메시지 ID: {message.id}</p>
              <p className="text-sm text-gray-600">
                <strong>마지막 메시지:</strong> {message.lastMessage}
              </p>
              <p className="text-sm text-gray-600">
                <strong>상품 ID:</strong> {message.productId}
              </p>
              <p className="text-sm text-gray-600">
                <strong>생성일:</strong>{" "}
                {message.createdAt.toDate().toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>업데이트일:</strong>{" "}
                {message.updatedAt.toDate().toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>참여자:</strong>
              </p>
              <ul className="list-disc list-inside pl-4">
                {message.users.map((user) => (
                  <li key={user.id} className="text-sm text-gray-600">
                    {user.name} (ID: {user.id})
                  </li>
                ))}
              </ul>
            </div>
            {expandedMessageId === message.id && (
              <div className="mt-4 pl-4 border-l-2 border-gray-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  하위 메시지 내용
                </h3>
                <ul className="space-y-2">
                  {subMessages[message.id]?.map((subMessage) => (
                    <li
                      key={subMessage.id}
                      className="p-2 bg-gray-100 rounded-lg shadow-sm"
                    >
                      <p className="text-sm text-gray-600">
                        <strong>메시지 내용:</strong> {subMessage.content}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>발송 시간:</strong>{" "}
                        {subMessage.createdAt.toDate().toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>발송자 ID:</strong> {subMessage.senderId}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
