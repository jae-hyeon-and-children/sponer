import { useEffect } from "react";

const DaumPostcodeScript = () => {
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

// DaumPostcodeScript 함수형 컴포넌트를 정의합니다.
// 컴포넌트가 마운트될 때 실행되는 부수 효과를 처리합니다.
// 클라이언트 사이드에서만 실행되도록 윈도우 객체가 정의되어 있고 'daum'이 정의되어 있지 않은 경우에만 실행됩니다.
// Daum 우편번호 스크립트를 동적으로 생성하고 로드합니다.
// 컴포넌트가 언마운트될 때, 생성한 스크립트를 제거합니다.
// DaumPostcodeScript 컴포넌트는 실제로 렌더링되는 것이 없으므로 null을 반환합니다.
// DaumPostcodeScript 컴포넌트를 내보냅니다.
