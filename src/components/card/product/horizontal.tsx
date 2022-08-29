import { Product } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";

interface Props {
  product: Product;
}

const HorizontalCard: FC<Props> = ({ product }) => {
  return (
    <div className="flex p-2 max-h-40 md:p-4 h-auto w-full justify-center items-center rounded-md bg-base-300 shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-300 ease-in-out">
      <div className="w-28 md:h-36 h-28 md:w-36 shrink-0">
        <Image
          layout="responsive"
          className="aspect-square object-contain rounded-lg"
          height={112}
          width={112}
          src={product.thumbnail_url || ""}
          alt={product.title}
        />
      </div>
      <div className="px-4 h-full flex flex-col justify-between ">
        <p
          className="text-sm font-medium flex line-clamp-4"
          style={{ overflowWrap: "anywhere" }}
        >
          {product.title}
        </p>
        {product.price && (
          <div className="mt-1 flex justify-end items-end text-black dark:text-white">
            <span className="text-base font-medium">
              {product.price.toLocaleString()}
            </span>
            <span className="font-bold text-sm  mr-1">تومان</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalCard;
