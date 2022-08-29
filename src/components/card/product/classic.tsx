import { Product } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";

interface Props {
  product: Product;
}

const Card: FC<Props> = ({ product }) => {
  return (
    <div className="flex flex-col w-full justify-center rounded-md bg-base-300 shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-300 ease-in-out">
      <div className="h-full w-full">
        <Image
          layout="responsive"
          className="aspect-square object-contain"
          height={112}
          width={112}
          src={product.thumbnail_url || ""}
          alt={product.title}
        />
      </div>
      <div className="w-full flex-col h-full p-4 ">
        <p className="text-sm line-clamp-4  font-medium">{product.title}</p>
        {product.price && (
          <div className="mt-2 flex justify-end items-center text-black dark:text-white">
            <span className="text-base font-medium">
              {product.price.toLocaleString()}
            </span>
            <span className="font-bold text-sm mr-1">تومان</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
