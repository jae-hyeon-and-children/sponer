export const ProductSideBar = () => {
	return (
		<div className="w-[15rem] border-r border-r-gray-200 flex flex-col fixed top-0 left-0 h-screen">
			<div className="flex flex-col pt-40 pl-14 gap-11">
				<div className="h-fit flex flex-col gap-6">
					<span className="text-gray-900 heading-2">회원 정보</span>
					<span className="text-gray-400 label-2 pt-2">프로필 관리</span>
					<span className="text-gray-400 label-2 pt-2">탈퇴하기</span>
				</div>
				<div className="h-fit flex flex-col gap-6">
					<span className="text-gray-900 heading-2">상품 관리</span>
					<span className="text-gray-400 label-2 pt-2">상품 관리</span>
				</div>
				<div className="h-fit flex flex-col gap-6">
					<span className="text-gray-900 heading-2">문의</span>
					<span className="text-gray-400 label-2 pt-2">1:1 문의</span>
					<span className="text-gray-400 label-2">FAQ 자주 묻는 질문</span>
				</div>
			</div>
		</div>
	);
};
