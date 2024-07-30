import React from "react";

interface NoticeProps {
  message: React.ReactNode;
}

const Notice: React.FC<NoticeProps> = ({ message }) => {
  return (
    <div className="text-sm text-gray-600 text-start bg-gray-50">{message}</div>
  );
};

export default Notice;
