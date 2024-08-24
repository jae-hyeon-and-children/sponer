// import { Timestamp } from "firebase/firestore";
// import { IBrandApplication } from "@/model/user";
// import { getHistoryById } from "./actions";
// import { ProductSideBar } from "@/components/my-page/side-bar";
// import { getFullDate } from "@/libs/utils/date";
// import StatusStep from "@/components/my-page/status-step";

// export default async function EditProfile({
// 	params,
// }: {
// 	params: { id: string };
// }) {
// 	const history: IBrandApplication[] = await getHistoryById(params.id);
// 	const latestHistory = history[0];

// 	let latestStatus = "신청 완료";

// 	if (latestHistory.reason) {
// 		latestStatus = "신청 완료";
// 	} else if (latestHistory.approve) {
// 		latestStatus = "승인 완료";
// 	} else {
// 		latestStatus = "승인 확인 중";
// 	}

// 	if (history.length === 0) {
// 		return <div>No history records found.</div>;
// 	}

// 	return (
// 		<main className="flex  text-gray-900 label-1">
// 			<ProductSideBar />
// 			<div className="w-full mt-20">
// 				<div className="w-full h-52 bg-primary pl-4 md:pl-36">
// 					<div className="display text-gray-100 pt-36">브랜드 신청 이력</div>
// 				</div>
// 				<StatusStep status={latestStatus.toString()} />
// 				<ul className="flex flex-col w-full gap-4 p-4 md:px-36 max-w-screen-xl">
// 					<li className="grid grid-cols-4 text-center border-b-2 border-black">
// 						<p>신청일</p>
// 						<p>브랜드명</p>
// 						<p>승인결과</p>
// 						<p>비고</p>
// 					</li>
// 					{history.map((history) => (
// 						<li
// 							className="grid grid-cols-4 text-center border-b-2 border-black"
// 							key={history.createdAt.toMillis()}
// 						>
// 							<p>{getFullDate(history.createdAt)}</p>
// 							<p>{history.brandName}</p>
// 							<p>
// 								{history.reason
// 									? "승인 거절"
// 									: history.approve.toString() === "true"
// 									? "승인 완료"
// 									: "승인 대기"}
// 							</p>
// 							{history.reason && <p>{history.reason}</p>}
// 						</li>
// 					))}
// 				</ul>
// 			</div>
// 		</main>
// 	);
// }

import { Timestamp } from "firebase/firestore";
import { IBrandApplication } from "@/model/user";
import { getHistoryById } from "./actions";
import { ProductSideBar } from "@/components/my-page/side-bar";
import { getFullDate } from "@/libs/utils/date";
import StatusStep from "@/components/my-page/status-step";

export default async function EditProfile({
  params,
}: {
  params: { id: string };
}) {
  const history: IBrandApplication[] = await getHistoryById(params.id);

  if (history.length === 0) {
    return <div>No history records found.</div>;
  }

  const latestHistory = history[0];

  let latestStatus = "승인 확인 중";

  if (latestHistory) {
    if (latestHistory.reason) {
      latestStatus = "신청 거절";
    } else if (latestHistory.approve) {
      latestStatus = "승인 완료";
    }
  }

  return (
    <main className="flex text-gray-900 label-1">
      <ProductSideBar />
      <div className="w-full mt-20">
        <div className="w-full h-52 bg-primary pl-4 md:pl-36">
          <div className="display text-gray-100 pt-36">브랜드 신청 이력</div>
        </div>
        <StatusStep status={latestStatus.toString()} />
        <ul className="flex flex-col w-full gap-4 p-4 md:px-36 max-w-screen-xl">
          <li className="grid grid-cols-4 text-center border-b-2 border-black">
            <p>신청일</p>
            <p>브랜드명</p>
            <p>승인결과</p>
            <p>비고</p>
          </li>
          {history.map((item) => (
            <li
              className="grid grid-cols-4 text-center border-b-2 border-black"
              key={item.createdAt.toMillis()}
            >
              <p>{getFullDate(item.createdAt)}</p>
              <p>{item.brandName}</p>
              <p>
                {item.reason
                  ? "승인 거절"
                  : item.approve
                  ? "승인 완료"
                  : "승인 대기"}
              </p>
              {item.reason && <p>{item.reason}</p>}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
