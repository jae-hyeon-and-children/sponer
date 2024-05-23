import { getProductById } from "./actions";
import ProductForm from "@/app/components/product/productForm";

export default async function EditProduct({
	params,
}: {
	params: { id: string };
}) {
	const product = await getProductById(params.id);

	return <ProductForm data={product} />;
}
