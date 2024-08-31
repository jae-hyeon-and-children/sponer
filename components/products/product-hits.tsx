import { UseHitsProps, useInfiniteHits } from "react-instantsearch";
import ProductItem from "./product-item";
import EmptyView from "../global/empty-view";
import { IProduct } from "@/model/product";
import Link from "next/link";

export default function ProductHits(props: UseHitsProps<IProduct>) {
  const { hits } = useInfiniteHits<IProduct>(props);

  return (
    <section className="w-full">
      {hits.length === 0 ? (
        <EmptyView text="해당 상품이 없습니다" />
      ) : (
        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 p-4">
          {hits.map((hit) => (
            <li
              key={hit.objectID}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <Link href={`/product/${hit.objectID}`} className="block h-full">
                <ProductItem
                  imageUrl={hit.productImages[0]}
                  title={hit.title}
                  size={hit.size}
                  height={hit.height}
                  brandName={hit.brandName || "Unknown BrandUser"}
                  styleCategory={hit.styleCategory}
                  productCategory={hit.productCategory}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
