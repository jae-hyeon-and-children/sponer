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
        <ul className=" w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-20">
          {hits.map((hit) => (
            <Link key={hit.objectID} href={`/product/${hit.objectID}`}>
              <ProductItem
                imageUrl={hit.productImages[0]}
                title={hit.title}
                size={hit.size}
                height={hit.height}
              />
            </Link>
          ))}
        </ul>
      )}
    </section>
  );
}
