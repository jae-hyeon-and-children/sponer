import { useEffect } from "react";

declare global {
  interface Window {
    daum: any;
  }
}

const DaumPostcodeScript: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.daum) {
      const script = document.createElement("script");
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return null;
};

export default DaumPostcodeScript;
