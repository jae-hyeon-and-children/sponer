"use client";

interface ChatRoomSectionProps {
  children: React.ReactNode;
}

export default function ChatRoomSection({ children }: ChatRoomSectionProps) {
  return (
    <section className="sticky top-0 overflow-y-scroll scrollbar-hide w-96 bg-gray-100 px-6 py-8 border-r border-r-gray-200">
      {children}
    </section>
  );
}
