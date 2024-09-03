"use client";

import Image from "next/image";
import IcPhoto from "@/public/icons/ic_photo.png";
import IcSend from "@/public/icons/ic_send.png";

import { storage } from "@/config/firebase/firebase";
import {
  ChangeEvent,
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  FormEvent,
} from "react";
import { sendMessage } from "@/libs/api/chats";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ContentType, STORAGE_REF_CHAT_IMAGES } from "@/constants/variables";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { chatRoomIdState, showProductSectionState } from "@/recoil/atoms";
import { useSession } from "next-auth/react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export default function MessageForm() {
  const { data: session } = useSession();
  const uid = session?.user?.id || ""; // Ensure uid is always a string
  const chatRoomId = useRecoilValue(chatRoomIdState) || "";
  const showProductSection = useRecoilValue(showProductSectionState);
  const setShowProductSection = useSetRecoilState(showProductSectionState);
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentToken, setCurrentToken] = useState<string>("");

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      console.log("Notification permission:", permission);
      if (permission !== "granted") {
        console.warn("Notifications not granted by the user.");
      }
    });
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js", { scope: "/" })
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((err) => {
          console.log("Service Worker registration failed:", err);
        });
    }

    const messaging = getMessaging();
    getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          console.log("FCM Token:", currentToken);
          setCurrentToken(currentToken);
          saveFcmToken(uid, currentToken);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("Error retrieving FCM token: ", err);
      });

    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
    });
  }, [uid]);

  const saveFcmToken = async (userId: string, token: string) => {
    try {
      await fetch("/api/saveFcmToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, token }),
      });
    } catch (error) {
      console.error("Error saving FCM token:", error);
    }
  };

  const getUserFcmToken = async (
    chatRoomId: string,
    senderId: string
  ): Promise<string | null> => {
    try {
      const response = await fetch("/api/getUserFcmToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatRoomId, senderId }),
      });
      if (!response.ok) {
        throw new Error("Failed to retrieve recipient FCM token.");
      }
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error retrieving recipient FCM token:", error);
      return null;
    }
  };

  const sendPushNotification = async (
    recipientToken: string,
    title: string,
    body: string,
    senderId: string,
    chatRoomId: string,
    senderToken: string
  ) => {
    console.log(
      `푸시 알림 전송 시도중, 수신자 토큰: ${recipientToken}, 제목: ${title}, 본문: ${body}, 보낸이: ${senderId}, 채팅방넘버: ${chatRoomId}`
    );
    try {
      const response = await fetch("/api/sendPushNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: recipientToken,
          body,
          senderId,
          senderToken,
          link: `/chats/${chatRoomId}`,
        }),
      });
      const result = await response.json();
      console.log("푸시 알림 응답:", result);
    } catch (error) {
      console.error("푸시 알림 전송 오류:", error);
    }
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    resizeTextarea();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isComposing) {
      event.preventDefault();
      if (message.trim() || file) {
        handleSubmit(event);
      }
    }
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSending) return;
    setIsSending(true);

    if (!message.trim() && !file) {
      setIsSending(false);
      return;
    }

    try {
      const recipientToken = await getUserFcmToken(chatRoomId, uid);
      if (file) {
        const storageRef = ref(
          storage,
          `${STORAGE_REF_CHAT_IMAGES}/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Image upload failed:", error);
            setIsSending(false);
          },
          async () => {
            const imageURL = await getDownloadURL(uploadTask.snapshot.ref);
            await sendMessage(uid, chatRoomId, imageURL, ContentType.image);
            setMessage("");
            setFile(null);
            if (recipientToken) {
              await sendPushNotification(
                recipientToken,
                "New Image Message",
                "You have received a new image.",
                uid,
                chatRoomId,
                currentToken
              );
            }
            setIsSending(false);
          }
        );
      } else {
        await sendMessage(uid, chatRoomId, message, ContentType.text);
        setMessage("");
        if (recipientToken) {
          await sendPushNotification(
            recipientToken,
            "New Message",
            message,
            uid,
            chatRoomId,
            currentToken
          );
        }
        setIsSending(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSending(false);
    }
  };

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowProductSection(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setShowProductSection]);

  return (
    <div
      className={`sticky bottom-0 flex items-center px-3 pb-4 transition-all duration-300 ease-in-out ${
        showProductSection ? "md:w-2/3" : "w-full"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex gap-8 items-center w-full bg-white border-gray-200 border rounded-full py-5 px-4"
      >
        <input
          type="file"
          className="hidden"
          id="file-upload"
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer shrink-0 w-7 h-7 p-1 flex justify-center items-center"
        >
          <Image
            src={IcPhoto}
            alt="photo"
            width={24}
            height={24}
            className="w-full aspect-square"
          />
        </label>
        {file ? (
          <p className="text-gray-500 text-sm truncate w-full">{file.name}</p>
        ) : (
          <textarea
            ref={textareaRef}
            name="content"
            placeholder="메세지를 입력해 주세요"
            className="w-full bg-transparent resize-none overflow-hidden"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            rows={1}
          />
        )}
        <button
          type="submit"
          disabled={!message.trim() && !file}
          className="shrink-0 bg-gray-100 w-7 h-7 p-1 rounded-full flex justify-center items-center"
        >
          <Image
            src={IcSend}
            alt="send"
            width={24}
            height={24}
            className="w-full aspect-square"
          />
        </button>
      </form>
    </div>
  );
}
