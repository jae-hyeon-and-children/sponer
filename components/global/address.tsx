"use client";

import { useEffect, useState } from "react";
import DaumPostcodeScript from "../../libs/api/juso-api";

declare global {
  interface Window {
    daum: any;
  }
}

interface AddressFormProps {
  fullAddress?: string;
}

const AddressForm = ({ fullAddress }: AddressFormProps) => {
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [extraAddress, setExtraAddress] = useState("");

  useEffect(() => {
    if (fullAddress) {
      const [zonecode, addr, detailAddr, extraAddr] = fullAddress.split(", ");
      setPostcode(zonecode || "");
      setAddress(addr || "");
      setDetailAddress(detailAddr || "");
      setExtraAddress(extraAddr || "");
    }
  }, [fullAddress]);

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
    <div className="form-group  flex flex-col gap-2 w-full ">
      <DaumPostcodeScript />
      <div className="form-group flex flex-col gap-4 w-full">
        <div className="flex lg:flex-row lg:items-center w-full gap-2">
          <span className=" lg:w-1/4 flex items-center flex-shrink-0 whitespace-nowrap text-gray-900">
            우편번호
          </span>
          <input
            type="text"
            id="postal_code"
            name="postal_code"
            value={postcode}
            placeholder="우편번호"
            readOnly
            className="bg-transparent z-0 rounded-xl w-full lg:w-5/6 h-12 py-5 px-4 box-border border border-[#C6D0DC] placeholder-gray-300"
          />
          <button
            type="button"
            onClick={handleAddressSearch}
            className="flex justify-center items-center h-12 w-[25%] lg:w-1/6 py-5 px-4 focus:outline-none focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 box-border border bg-primary placeholder:text-neutral-400 rounded-xl"
          >
            <span className="paragraph-2 text-gray-100 ">주소 검색</span>
          </button>
        </div>

        <div className="flex lg:flex-row lg:items-center w-full gap-2">
          <span className="lg:w-1/4 flex-shrink-0 whitespace-nowrap text-gray-900 flex items-center">
            기본주소
          </span>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            placeholder="기본주소"
            readOnly
            className="bg-transparent z-0 rounded-xl w-full lg:w-5/6 h-12 py-5 px-4 box-border border border-[#C6D0DC] placeholder-gray-300"
          />
        </div>

        <div className="flex lg:flex-row lg:items-center w-full gap-2">
          <span className="lg:w-1/4 flex-shrink-0 whitespace-nowrap text-gray-900 flex items-center">
            상세주소
          </span>
          <input
            type="text"
            id="detail_address"
            name="detail_address"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="상세주소"
            className="bg-transparent z-0 rounded-xl w-full lg:w-5/6 h-12 py-5 px-4 box-border border border-[#C6D0DC] placeholder-gray-300"
          />
        </div>

        <div className="flex lg:flex-row lg:items-center w-full gap-2">
          <span className="lg:w-1/4 flex-shrink-0 whitespace-nowrap text-gray-900 flex items-center">
            참고항목
          </span>
          <input
            type="text"
            id="extra_address"
            name="extra_address"
            value={extraAddress}
            placeholder="참고항목"
            readOnly
            className="bg-transparent z-0 rounded-xl w-full lg:w-5/6 h-12 py-5 px-4 box-border border border-[#C6D0DC] placeholder-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
