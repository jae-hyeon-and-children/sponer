"use client";
import { useState } from "react";

export default function Dropdown() {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<div className="w-full border-2 border-gray-200 mb-4  paragraph-1">
			<div
				className="w-full h-16 bg-white p-4 cursor-pointer flex justify-between items-center rounded-xl "
				onClick={toggleDropdown}
			>
				<span className="font-bold text-gray-800 py-5 px-8">
					Q 세토님과 만나려면 어떻게 해야하나요?
				</span>
				<span>{isOpen ? "▲" : "▼"}</span>
			</div>
			{isOpen && (
				<div className="bg-gray-50 p-4 shadow-md text-gray-500 px-16 py-6">
					<p>
						모든 국민은 사생활의 비밀과 자유를 침해받지 아니한다. 모든 국민은
						학문과 예술의 자유를 가진다. 모든 국민은 주거의 자유를 침해받지
						아니한다. 주거에 대한 압수나 수색을 할 때에는 검사의 신청에 의하여
						법관이 발부한 영장을 제시하여야 한다. 모든 국민은 법률이 정하는 바에
						의하여 국가기관에 문서로 청원할 권리를 가진다. 대통령은 제4항과
						제5항의 규정에 의하여 확정된 법률을 지체없이 공포하여야 한다.
						제5항에 의하여 법률이 확정된 후 또는 제4항에 의한 확정법률이 정부에
						이송된 후 5일 이내에 대통령이 공포하지 아니할 때에는 국회의장이 이를
						공포한다.
					</p>
				</div>
			)}
		</div>
	);
}
