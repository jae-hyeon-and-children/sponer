import { getProductById } from "./actions";
import ProductForm from "@/components/product/productForm";

export default async function EditProduct({
	params,
}: {
	params: { id: string };
}) {
	const product = await getProductById(params.id);

	if (!product) return;

	return <ProductForm data={product} />;
}
