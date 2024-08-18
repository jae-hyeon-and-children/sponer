"use client";

interface MessageSectionProps {
  children: React.ReactNode;
}

export default function MessageSection({ children }: MessageSectionProps) {
  return <section className="flex-1 flex flex-col">{children}</section>;
}
