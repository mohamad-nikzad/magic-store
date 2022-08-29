/* eslint-disable @next/next/no-img-element */
import { Dialog } from "@/components";
import { trpc } from "@/util/trpc";
import { Product } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ElementRef, FC, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { removeCookies } from "cookies-next";
import Image from "next/image";
import Card from "@/components/card/product/classic";
import HorizontalCard from "@/components/card/product/horizontal";

const productSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  price: z
    .string()
    .transform((item) => +item)
    .nullish(),
});

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.access_token) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return { props: {} };
};

const Store: NextPage = () => {
  const router = useRouter();
  const util = trpc.useContext();
  const modalRef = useRef<ElementRef<typeof Dialog>>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [username, setUsername] = useState("");

  const { register, unregister, handleSubmit } = useForm({
    resolver: zodResolver(productSchema),
  });

  const {
    register: register2,
    unregister: unregister2,
    handleSubmit: handleSubmit2,
  } = useForm();

  const user = trpc.useQuery(["user-get"], { enabled: true });
  const product = trpc.useMutation("product-update", {
    onSuccess: (data) => {
      util.invalidateQueries(["user-get"]);
      modalRef.current && modalRef.current.close();
      setCurrentProduct(null);
      unregister();
    },
  });

  const updateUsername = trpc.useMutation("user-update", {
    onSuccess: (data) => {
      console.log(data);
      util.invalidateQueries(["user-get"]);
      modalRef.current && modalRef.current.close();
      setUsername("");
      unregister2();
    },
  });

  const openModalHandler = (data: Product) => {
    setCurrentProduct(data);
    modalRef.current && modalRef.current.open();
  };

  const updateProductHandler = (data: any) => {
    currentProduct && product.mutate({ product_id: currentProduct.id, data });
  };

  const updateUsernameHandler = (data: any) => {
    username && updateUsername.mutate({ username: data.username });
  };

  const logoutHandler = async () => {
    removeCookies("access_token");
    router.push("/");
  };

  const closeModalHandler = () => {
    currentProduct !== null && setCurrentProduct(null);
    username !== "" && setUsername("");
    unregister();
  };

  const openChangeUsernameModal = () => {
    user.data &&
      setUsername(user.data.username || user.data.instagram_id || "");
    modalRef.current && modalRef.current.open();
  };

  console.log(user.data);

  return (
    <div className="w-full   relative min-h-screen from-base-100 to-base-300 bg-gradient-to-br">
      <div className="navbar justify-between px-4 bg-base-300 shadow top-0 sticky z-10">
        <div>
          <h1 className="text-xl px-3">
            {user.data?.username || user.data?.instagram_id || "site name"}
          </h1>
          <button
            className="btn btn-square btn-ghost"
            onClick={openChangeUsernameModal}
          >
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
          </button>
        </div>
        <button className="btn btn-outline btn-error" onClick={logoutHandler}>
          خروج
        </button>
      </div>
      <div className="container p-4 md:p-6 mx-auto">
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {user?.data?.products &&
            user.data?.products.map((product: Product, index: number) => (
              <Card product={product} key={index} />
            ))}
        </div> */}
        <div className="grid grid-cols-1 gap-5 max-w-4xl mx-auto">
          {user?.data?.products &&
            user.data?.products.map((product: Product, index: number) => (
              <HorizontalCard product={product} key={index} />
            ))}
        </div>
      </div>
      <Dialog
        title={currentProduct ? "Update product" : "update site title"}
        containerClassName="bg-base-300 !h-fit shadow shadow-purple-900"
        ref={modalRef}
        onClose={closeModalHandler}
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
        {username && (
          <form
            className="form-control pb-6"
            onSubmit={handleSubmit2(updateUsernameHandler)}
          >
            <label htmlFor="username">
              <span className="label">site name</span>
            </label>
            <input
              type="text"
              {...register2("username")}
              className="input input-primary"
              placeholder="enter site name"
              defaultValue={username}
            />
            <button
              className="btn btn-primary mt-4"
              type="submit"
              disabled={updateUsername.isLoading}
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
