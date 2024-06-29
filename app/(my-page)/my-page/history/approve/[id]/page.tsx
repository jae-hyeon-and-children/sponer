import { IBrandApplication } from "@/model/user";
import { ProductSideBar } from "@/components/my-page/side-bar";
import { getFullDate } from "@/libs/utils/date";
import StatusStep from "@/components/my-page/status-step";
import { approveBrand } from "./actions";

export default async function ApproveBrand({
	params,
}: {
	params: { id: string };
}) {
	const history = await approveBrand(params.id);

	console.log(params.id);

	return (
		<>
			<div>{`${params.id}의 브랜드 승인 완료`}</div>
		</>
	);
}
