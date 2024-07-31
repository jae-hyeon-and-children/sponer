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
  showDefaultModalState,
  modalMessageState,
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
import Modal from "@/components/global/modal";

export default function ChatRoomList() {
  const { data: session, status } = useSession();
  const chatRoomId = useRecoilValue(chatRoomIdState);
  const setChatRoomUser = useSetRecoilState(chatRoomUserState);
  const setChatRoomProduct = useSetRecoilState(chatRoomProductState);
  const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);
  const [unreadCounts, setUnreadCounts] = useRecoilState(unreadCountState);
  const [showModal, setShowModal] = useRecoilState(showDefaultModalState);
  const [modalMessage, setModalMessage] = useRecoilState(modalMessageState);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(
    null
  );
  const router = useRouter();
  const uid = session?.user?.id;

  const getOtherUser = (chatRoom: IChatRoom) =>
    chatRoom.users.find((user) => user.id !== uid);

  const handleDeleteChatRoom = async () => {
    if (selectedChatRoomId) {
      try {
        const response = await fetch("/api/deleteChatRoom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatRoomId: selectedChatRoomId }),
        });

        const result = await response.json();
        if (result.success) {
          setChatRooms((prevRooms) =>
            prevRooms.filter((room) => room.id !== selectedChatRoomId)
          );
          setModalMessage("채팅방이 삭제되었습니다.");
        } else {
          setModalMessage(result.message || "채팅방 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error deleting chat room: ", error);
        setModalMessage("채팅방 삭제에 실패했습니다.");
      } finally {
        setShowModal(false);
      }
    }
  };

  const confirmDeleteChatRoom = (chatRoomId: string) => {
    setSelectedChatRoomId(chatRoomId);
    setModalMessage(
      "정말로 삭제하시겠습니까? 삭제된 내용은 복구할 수 없으며, 양쪽 모두에서 삭제됩니다."
    );
    setShowModal(true);
  };

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

          // Fetch unread message counts
          const counts: { [key: string]: number } = {};
          for (const chatRoom of convertedChatRooms) {
            const messagesSnapshot = await getDocs(
              collection(
                fireStore,
                `${COLLECTION_NAME_CHAT}/${chatRoom.id}/${COLLECTION_NAME_MESSAGE}`
              )
            );
            counts[chatRoom.id!] = messagesSnapshot.docs.filter((doc) => {
              const data = doc.data() as IMessage;
              if (!Array.isArray(data.readBy)) {
                data.readBy = [];
              }
              return data.senderId !== uid && !data.readBy.includes(uid);
            }).length;
          }
          setUnreadCounts(counts);

          // Sort chat rooms based on unread counts and updatedAt
          const sortedChatRooms = convertedChatRooms.sort((a, b) => {
            const countA = counts[a.id!] || 0;
            const countB = counts[b.id!] || 0;
            if (countA === countB) {
              return b.updatedAt.seconds - a.updatedAt.seconds; // 최근 업데이트 기준
            }
            return countB - countA; // 읽지 않은 메시지 수 기준
          });

          setChatRooms(sortedChatRooms);

          let selectedChatRoom = sortedChatRooms.find(
            (chatRoom) => chatRoom.id == chatRoomId
          );

          if (selectedChatRoom === undefined && sortedChatRooms[0]) {
            router.push(`/chats/${sortedChatRooms[0].id}`);
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
        }
      );
      return () => {
        unSubscribeChatRooms();
      };
    } else {
      router.push("/login");
    }
  }, [chatRoomId, router, setChatRoomProduct, setChatRoomUser, uid, status]);

  return (
    <ul className="flex flex-col gap-4 ">
      {chatRooms.map((value, index) => {
        const otherUser = getOtherUser(value);
        return (
          <div key={index} className="relative">
            <Link href={`/chats/${value.id}`}>
              <ChatRoom
                imageUrl={otherUser!.profileImage}
                name={otherUser!.name}
                message={value.lastMessage}
                sentDate={timeStampToDate(value.updatedAt)}
                isSelected={value.id === chatRoomId}
                unreadCount={unreadCounts[value.id!] || 0}
              />
            </Link>
            <button
              className="absolute right-1 top-0 text-red-500 text-xs"
              onClick={() => confirmDeleteChatRoom(value.id!)}
            >
              X
            </button>
          </div>
        );
      })}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">경고</h2>
            <p className="mb-4">{modalMessage}</p>
            <button
              className="border bg-primary rounded-full w-40 h-10 flex justify-center items-center"
              onClick={handleDeleteChatRoom}
            >
              <span className="label-1 text-gray-100">삭제</span>
            </button>
          </div>
        </Modal>
      )}
    </ul>
  );
}
