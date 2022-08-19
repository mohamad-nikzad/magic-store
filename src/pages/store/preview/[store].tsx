/* eslint-disable @next/next/no-img-element */
import { Dialog } from "@/components";
import { trpc } from "@/util/trpc";
import { previewProduct } from "@prisma/client";
import { router } from "@trpc/server";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ElementRef, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

const Store: NextPage = () => {
  const store = useRouter().query.store as string;
  const { push } = useRouter();
  const modalRef = useRef<ElementRef<typeof Dialog>>(null);
  const { register, handleSubmit } = useForm();

  const account = trpc.useQuery(["account-get", store], { enabled: false });
  useEffect(() => {
    !account.isFetched && account.refetch();
  }, [account]);

  const registerUser = trpc.useMutation("user-register", {
    onSuccess: (data) => {
      modalRef.current && modalRef.current.close();
      data.access_token && push("/store/me");
    },
  });

  const openModalHandler = () => {
    modalRef.current && modalRef.current.open();
  };

  const registerHandler = (data: any) => {
    registerUser.mutate({
      phonenumber: data.phonenumber,
      password: data.password,
      instagram_id: store,
    });
  };

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
          <a className="text-xl px-3">{account.data?.instagram_id || store}</a>
        </div>

        <button
          onClick={openModalHandler}
          className="btn btn-primary btn-outline"
        >
          Register
        </button>
      </div>
      <div className="container p-6">
        <h2 className="mb-3 text-base font-medium">
          for making changes like editing/adding product info,title,price,... or
          changing your website name please
          <button className="btn btn-link" onClick={openModalHandler}>
            login
          </button>
          :)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {account?.data?.previewProducts &&
            account.data?.previewProducts.map((product: previewProduct) => (
              <div
                className="card p-2 card-compact bg-base-100 shadow-sm border-2 border-purple-900 shadow-purple-900"
                key={product.id}
              >
                <img
                    className="rounded-xl object-contain h-60 w-auto"
                    src={product.thumbnail_url || ""}
                    alt="image"
                  />
                <div className="card-body">
                  <h2 className="card-title line-clamp-2">{product.title}</h2>
                  <div className="card-actions justify-end">
                    <button className="btn btn-warning gap-1 btn-sm">
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
                      Edit now !
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Dialog
        title="Register"
        containerClassName="bg-base-300 !h-fit shadow shadow-purple-900"
        ref={modalRef}
      >
        <form
          className="form-control pb-4"
          onSubmit={handleSubmit(registerHandler)}
        >
          <label htmlFor="instagram_id" className="label">
            <span className="label-text font-bold ">Phonenumber</span>
          </label>
          <input
            type="tel"
            id="phonenumber"
            disabled={registerUser.isLoading}
            {...register("phonenumber", { required: true })}
            className="input input-bordered input-primary"
            placeholder="enter your phonenumber"
          />
          <label htmlFor="password" className="label">
            <span className="label-text font-bold ">Password</span>
          </label>
          <input
            type="password"
            id="password"
            disabled={registerUser.isLoading}
            {...register("password", { required: true })}
            className="input input-bordered input-primary"
            placeholder="enter your password"
          />
          <button
            className="btn btn-primary mt-4"
            type="submit"
            disabled={registerUser.isLoading}
          >
            register
          </button>
        </form>
      </Dialog>
    </div>
  );
};

export default Store;
