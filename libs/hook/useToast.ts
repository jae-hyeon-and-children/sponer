import { useRecoilState } from "recoil";
import { toastState, ToastMessage, ToastType } from "@/recoil/atoms";

export default function useToast() {
  const [toast, setToast] = useRecoilState<ToastMessage>(toastState);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ isVisible: true, message, type });
  };

  return showToast;
}
