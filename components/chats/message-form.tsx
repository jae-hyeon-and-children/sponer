"use client";

import Image from "next/image";
import IcPhoto from "@/public/icons/ic_photo.png";
import IcSend from "@/public/icons/ic_send.png";

import { storage } from "@/config/firebase/firebase";
import { ChangeEvent, useState } from "react";
import { sendMessage } from "@/libs/api/chats";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ContentType, STORAGE_REF_CHAT_IMAGES } from "@/constants/variables";
import { useRecoilValue } from "recoil";
import { chatRoomIdState } from "@/recoil/atoms";
import useAuth from "@/libs/hook/useAuth";

export default function MessageForm() {
  const uid = useAuth()?.uid;
  const chatRoomId = useRecoilValue(chatRoomIdState);
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (file) {
      const storageRef = ref(
        storage,
        `${STORAGE_REF_CHAT_IMAGES}/${file.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error("Image upload failed:", error);
        },
        async () => {
          const imageURL = await getDownloadURL(uploadTask.snapshot.ref);
          await sendMessage(uid!, chatRoomId!, imageURL, ContentType.image);
        }
      );
    } else {
      await sendMessage(uid!, chatRoomId!, message, ContentType.text);
    }

    setFile(null);
    setMessage("");
  };

  return (
    <div className="sticky bottom-0 flex items-center px-3 pb-4">
      <form
        onSubmit={handleSubmit}
        className=" flex gap-8 items-center w-full bg-white border-gray-200 border rounded-full py-5 px-4"
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
          <input
            type="text"
            name="content"
            placeholder="메세지를 입력해 주세요"
            className="w-full bg-transparent"
            value={message}
            onChange={handleMessageChange}
          />
        )}
        <button
          type="submit"
          disabled={!message.trim() && !file}
          className=" shrink-0 bg-gray-100 w-7 h-7 p-1 rounded-full flex justify-center items-center"
        >
          <Image
            src={IcSend}
            alt="photo"
            width={24}
            height={24}
            className="w-full aspect-square"
          />
        </button>
      </form>
    </div>
  );
}
