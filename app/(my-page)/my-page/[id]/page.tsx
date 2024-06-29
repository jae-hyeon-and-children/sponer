import ProductForm from "@/components/my-page/product-form";
import { getUserById } from "./actions";
import BrandUserForm from "@/components/my-page/user/brand/brand-form";
import StylistUserForm from "@/components/my-page/user/stylist/stylist-form";

export default async function EditProfile({
	params,
}: {
	params: { id: string };
}) {
	const user = await getUserById(params.id);

	if (!user) return;

	console.log(user);

	return (
		<>
			{user.userType === "brand" ? (
				<BrandUserForm data={user} userId={params.id} />
			) : (
				<StylistUserForm data={user} userId={params.id} />
			)}
		</>
	);
}
