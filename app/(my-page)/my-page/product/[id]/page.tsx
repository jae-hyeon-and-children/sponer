import EditProductForm from "@/components/my-page/product/edit-product";
import { getProductById } from "./actions";

export default async function EditProduct({
	params,
}: {
	params: { id: string };
}) {
	const product = await getProductById(params.id);

	if (!product) return;

	return <EditProductForm data={product} />;
}
