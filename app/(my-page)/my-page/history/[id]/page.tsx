import { Timestamp } from "firebase/firestore";
import { IHistory } from "@/model/user";
import { getHistoryById } from "./actions";
import { ProductSideBar } from "@/components/my-page/side-bar";
import { getFullDate } from "@/libs/utils/date";
import StatusStep from "@/components/my-page/status-step";

export default async function EditProfile({
	params,
}: {
	params: { id: string };
}) {
	const history: IHistory[] = await getHistoryById(params.id);
	const latestHistory = history[0];

	let latestStatus = "신청 완료";

	if (latestHistory.reason) {
		latestStatus = "신청 완료";
	} else if (latestHistory.approve) {
		latestStatus = "승인 완료";
	} else {
		latestStatus = "승인 확인 중";
	}

	if (history.length === 0) {
		return <div>No history records found.</div>;
	}

	return (
		<main className="flex h-screen max-w-screen-2xl  text-gray-900 label-1">
			<ProductSideBar />
			<div className="w-full">
				<div className="w-full h-[10rem] bg-primary mt-[5.25rem] flex justify-center relative">
					<div className="h-fit flex w-5/6 justify-between absolute bottom-8">
						<div className="display text-gray-100">브랜드 신청 이력</div>
					</div>
				</div>
				<StatusStep status={latestStatus.toString()} />
				<ul className="flex flex-col w-full gap-4 p-12">
					<li className="grid grid-cols-4 text-center border-b-2 border-black">
						<p>신청일</p>
						<p>브랜드명</p>
						<p>승인결과</p>
						<p>비고</p>
					</li>
					{history.map((history) => (
						<li
							className="grid grid-cols-4 text-center border-b-2 border-black"
							key={history.createdAt.toMillis()}
						>
							<p>{getFullDate(history.createdAt)}</p>
							<p>{history.brandName}</p>
							<p>{history.approve.toString()}</p>
							{history.reason && <p>{history.reason}</p>}
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}
