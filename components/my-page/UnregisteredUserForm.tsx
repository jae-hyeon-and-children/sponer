"use client";

import { useRouter } from "next/navigation";
import { ProductSideBar } from "@/components/my-page/side-bar";
import { IUser } from "@/model/user";

interface UserFormProps {
  data: IUser;
  userId: string;
}

const UnregisteredUserForm: React.FC<UserFormProps> = ({ data, userId }) => {
  const router = useRouter();

  const handleRegisterClick = () => {
    router.push("/add-user");
  };

  return (
    <main className="flex flex-col lg:flex-row text-gray-900 label-1">
      <ProductSideBar />
      <div className="w-full  mt-20 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">아직 등록이 안된 유저이십니다!</h2>
          <p className="mt-4">함께 등록을 해볼까요?</p>
          <button
            onClick={handleRegisterClick}
            className="mt-8 px-6 py-3 bg-primary text-white rounded-full"
          >
            등록하러 가기
          </button>
        </div>
      </div>
    </main>
  );
};

export default UnregisteredUserForm;
