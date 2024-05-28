"use client";

import { useState } from "react";
import DaumPostcodeScript from "../app/api/juso-api";

declare global {
  interface Window {
    daum: any;
  }
}

interface IAddr {
  address: string;
  zonecode: string;
}
const AddressForm = () => {
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [extraAddress, setExtraAddress] = useState("");

  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
          let addr = "";
          let extraAddr = "";

          if (data.userSelectedType === "R") {
            addr = data.roadAddress;
          } else {
            addr = data.jibunAddress;
          }

          if (data.userSelectedType === "R") {
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            if (data.buildingName !== "" && data.apartment === "Y") {
              extraAddr +=
                extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
            }
            if (extraAddr !== "") {
              extraAddr = " (" + extraAddr + ")";
            }
            setExtraAddress(extraAddr);
          } else {
            setExtraAddress("");
          }

          setPostcode(data.zonecode);
          setAddress(addr);
          document.getElementById("detail_address")!.focus();
        },
      }).open();
    } else {
      console.error("Daum Postcode script is not loaded.");
    }
  };

  return (
    <div>
      <DaumPostcodeScript />
      <div className="form-group flex flex-col gap-2">
        <button
          type="button"
          onClick={handleAddressSearch}
          className="h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed rounded-md border border-gray-900"
        >
          우편번호 찾기
        </button>

        <input
          type="text"
          id="postal_code"
          name="postal_code"
          value={postcode}
          placeholder="우편번호"
          readOnly
          className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 gap-"
        />
      </div>

      <div className="form-group my-2">
        <input
          type="text"
          id="address"
          name="address"
          value={address}
          placeholder="주소"
          readOnly
          className="bg-transparent rounded-md w-[600px] h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        />
      </div>

      <div className="form-group my-2">
        <input
          type="text"
          id="detail_address"
          name="detail_address"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          placeholder="상세주소"
          className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          id="extra_address"
          name="extra_address"
          value={extraAddress}
          placeholder="참고항목"
          readOnly
          className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
};

export default AddressForm;

// Daum 우편번호 API를 사용하여 주소 검색을 처리하는 함수를 정의합니다.
// 전역 window 객체에 'daum'이 존재하는지 확인합니다.
// 새로운 Daum 우편번호 API 인스턴스를 생성합니다.
// 주소 검색이 완료되면 실행될 콜백 함수를 정의합니다.
// 주소와 참고항목을 저장할 변수를 초기화합니다.
// 선택된 주소 유형에 따라 주소를 설정합니다.
// 도로명 주소가 있는 경우 사용합니다.
// 도로명 주소가 없는 경우 사용합니다.
// 도로명 주소인 경우 참고항목을 추가합니다.
// 우편번호, 주소를 설정하고 상세주소 입력 필드에 포커스를 줍니다.
// JSX를 반환합니다.
{
  /* Daum 우편번호 스크립트를 로드합니다. */
}
{
  /* 주소 검색 버튼 */
}
{
  /* 우편번호 입력 필드 */
}
{
  /* 주소 입력 필드 */
}
{
  /* 상세주소 입력 필드 */
}
{
  /* 참고항목 입력 필드 */
}
// AddressForm 컴포넌트를 내보냅니다.
