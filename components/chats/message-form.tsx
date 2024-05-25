"use client";

import { storage } from "@/config/firebase/firebase";
import { STORAGE_REF_CHAT_IMAGES } from "@/constants/variables";

import { ChangeEvent, useState } from "react";
import { sendMessage } from "@/lib/api/chats";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

interface MessageFormProps {
  chatroomId: string;
}

export default function MessageForm({ chatroomId }: MessageFormProps) {
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
          await sendMessage(chatroomId, imageURL, "image");
        }
      );
    } else {
      await sendMessage(chatroomId, message, "text");
    }

    setFile(null);
    setMessage("");
  };

  return (
    <div className="sticky bottom-0  flex items-center px-3 pb-4">
      <form
        onSubmit={handleSubmit}
        className="flex gap-8 items-center w-full bg-white border-gray-200 border rounded-full py-5 px-3"
      >
        <input
          type="file"
          className="hidden"
          id="file-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <p>이미지</p>
        </label>
        {file ? (
          <p className="text-gray-500 text-sm truncate mb-16">{file.name}</p>
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
          className="disabled:bg-slate-100 w-6 h-6 rounded-full"
        >
          <p>전송</p>
        </button>
      </form>
    </div>
  );
}
