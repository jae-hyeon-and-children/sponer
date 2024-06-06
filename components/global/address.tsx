"use client";

import { useState } from "react";
import DaumPostcodeScript from "../../libs/api/juso-api";

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
    <div className="form-group flex flex-col gap-2 w-full items-center">
      <DaumPostcodeScript />
      <div className="form-group flex flex-col gap-4 w-full items-center ">
        <button
          type="button"
          onClick={handleAddressSearch}
          className="bg-transparent   rounded-md w-full lg:w-full py-5 px-4 focus:outline-none focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border border-black placeholder:text-neutral-400"
        >
          <span className="paragraph-2 text-gray-800">우편번호 찾기</span>
        </button>

        <div className="border-2 border-gray-400 rounded-md w-full lg:w-full">
          <input
            type="text"
            id="postal_code"
            name="postal_code"
            value={postcode}
            placeholder="우편번호"
            readOnly
            className="bg-transparent w-full py-5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
          />
        </div>

        <div className="border-2 border-gray-400 rounded-md w-full lg:w-full">
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            placeholder="주소"
            readOnly
            className="bg-transparent w-full py-5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
          />
        </div>

        <div className="border-2 border-gray-400 rounded-md w-full lg:w-full">
          <input
            type="text"
            id="detail_address"
            name="detail_address"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="상세주소"
            className="bg-transparent w-full py-5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
          />
        </div>

        <div className="border-2 border-gray-400 rounded-md w-full lg:w-full">
          <input
            type="text"
            id="extra_address"
            name="extra_address"
            value={extraAddress}
            placeholder="참고항목"
            readOnly
            className="bg-transparent w-full py-5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
          />
        </div>
      </div>
    </div>
  );
};
export default AddressForm;
