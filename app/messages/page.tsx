import Chat from "@/components/messages/chat";
import ChatRoom from "@/components/messages/chatroom";
import Image from "next/image";
import Link from "next/link";

export default function Messages() {
  return (
    <main className="flex h-screen">
      <section className="sticky top-0 overflow-y-scroll scrollbar-hide w-96 bg-gray-100 px-6 py-8 border-r border-r-gray-200">
        <h1 className="label-1 text-gray-600 mb-8">All Messages</h1>
        <ul className="flex flex-col gap-4">
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
        </ul>
      </section>
      <section className="flex-1 flex flex-col ">
        <div className="sticky top-0 bg-white border-b border-b-gray-200 flex justify-between items-center py-3 px-5">
          <div className="flex gap-4 items-center">
            <Image
              src={
                "https://flexible.img.hani.co.kr/flexible/normal/700/1040/imgdb/original/2021/0428/20210428504000.jpg"
              }
              width={24}
              height={24}
              alt={"상품 이미지"}
              className=" rounded-full w-6 h-6 object-cover"
            />
            <h2 className="heading-2 text-gray-800">오아이</h2>
          </div>
          <button className="caption text-gray-700 rounded-lg py-2 px-3 bg-gray-100">
            상품 보기
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-y-scroll scrollbar-hide">
          <ul className="px-6 py-4 flex-1 flex flex-col gap-5 justify-end ">
            <Chat />
            <Chat />
            <Chat />
            <Chat />
            <Chat />
            <Chat />
            <Chat />
            <Chat />
            <Chat />
          </ul>
          <div className="sticky bottom-0  flex items-center px-3 pb-4">
            <form
              action=""
              className="flex gap-8 items-center w-full bg-white border-gray-200 border rounded-full py-5 px-3"
            >
              <input type="file" className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.414 6.414m0 0L15.172 7m-6.414 6.414V3.828a2 2 0 012.828-2.828h7.172a2 2 0 012 2v7.172a2 2 0 01-2.828 2.828H10.586z"
                  />
                </svg>
              </label>
              <input
                type="text"
                placeholder="메세지를 입력해 주세요"
                className="w-full bg-transparent"
              />
            </form>
          </div>
        </div>
      </section>
      <section className="sticky top-0 overflow-y-scroll scrollbar-hide w-96 bg-white px-6 py-8 border-r border-r-gray-200">
        <h1 className="label-1 text-gray-600 mb-8">상품 기록</h1>
        <ul className="flex flex-col gap-4">
          <li>
            <p> 상품 이름</p>
            <p>날짜</p>
          </li>
        </ul>
      </section>
    </main>
  );
}
