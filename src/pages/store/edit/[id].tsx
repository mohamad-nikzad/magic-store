/* eslint-disable @next/next/no-img-element */
import { Dialog } from "@/components";
import { trpc } from "@/util/trpc";
import { Product } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ElementRef, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";

const productSchema = z.object({
  // id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  price: z
    .string()
    .transform((item) => +item)
    .nullish(),
});

const Store: NextPage = () => {
  const id = useRouter().query.id as string;
  const util = trpc.useContext();
  const modalRef = useRef<ElementRef<typeof Dialog>>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const user = trpc.useQuery(["user-get", +id], { enabled: true });
  const product = trpc.useMutation("product-update", {
    onSuccess: (data) => {
      util.invalidateQueries(["user-get", +id]);
      modalRef.current && modalRef.current.close();
      setCurrentProduct(null);
      unregister();
    },
  });

  const openModalHandler = (data: Product) => {
    setCurrentProduct(data);
    modalRef.current && modalRef.current.open();
  };

  const updateProductHandler = (data: any) => {
    console.log(data);
    currentProduct && product.mutate({ product_id: currentProduct.id, data });
  };

  console.log(currentProduct);

  return (
    <div className="w-full font-mono  relative min-h-screen from-base-100 to-base-300 bg-gradient-to-br">
      <div className="navbar justify-between bg-base-300 shadow top-0 sticky z-10">
        <div className="indicator">
          <div className="indicator-item indicator-bottom">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <a className="text-xl px-3">{user.data?.instagram_id || id}</a>
        </div>
      </div>
      <div className="container p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {user?.data?.products &&
            user.data?.products.map((product: Product) => (
              <div
                className="card p-2 card-compact bg-base-100 shadow-sm border-2 border-purple-900 shadow-purple-900"
                key={product.id}
              >
                <figure>
                  <img
                    className="rounded-xl object-contain h-60 w-auto"
                    src={product.thumbnail_url || ""}
                    alt={product.title}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title line-clamp-2">{product.title}</h2>
                  {product.description && (
                    <p className="text-sm">{product.description}</p>
                  )}
                  {product.price && (
                    <span className="text-base font-semibold">
                      {product.price}$
                    </span>
                  )}
                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-primary gap-1 btn-sm mx-auto"
                      onClick={() => openModalHandler(product)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Dialog
        title="Update product"
        containerClassName="bg-base-300 !h-fit shadow shadow-purple-900"
        ref={modalRef}
        onClose={() => {
          setCurrentProduct(null);
          unregister();
        }}
      >
        {currentProduct && (
          <form
            className="form-control pb-4"
            onSubmit={handleSubmit(updateProductHandler)}
          >
            <figure>
              <img
                className="rounded-xl object-contain h-80 w-auto mx-auto"
                src={currentProduct.thumbnail_url || ""}
                alt={currentProduct.title}
              />
            </figure>
            <label htmlFor="title" className="label">
              <span className="label-text font-bold ">title</span>
            </label>
            <input
              type="text"
              id="title"
              defaultValue={currentProduct.title}
              disabled={product.isLoading}
              {...register("title", {
                required: true,
              })}
              className="input input-bordered input-primary"
              placeholder="enter your title"
            />
            <label htmlFor="description" className="label">
              <span className="label-text font-bold ">description</span>
            </label>
            <input
              type="text"
              id="description"
              defaultValue={currentProduct.description || ""}
              disabled={product.isLoading}
              {...register("description")}
              className="input input-bordered input-primary"
              placeholder="enter your description"
            />
            <label htmlFor="price" className="label">
              <span className="label-text font-bold ">price</span>
            </label>
            <input
              type="number"
              id="price"
              defaultValue={currentProduct.price || ""}
              disabled={product.isLoading}
              {...register("price")}
              className="input input-bordered input-primary"
              placeholder="enter your price"
            />
            <button
              className="btn btn-primary mt-4"
              type="submit"
              disabled={product.isLoading}
            >
              update
            </button>
          </form>
        )}
      </Dialog>
    </div>
  );
};

export default Store;
