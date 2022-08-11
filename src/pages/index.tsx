import { trpc } from "@/util/trpc";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Dialog } from "@/components";
import { ElementRef, useRef } from "react";
import { getCookie } from "cookies-next";

const Home: NextPage = () => {
  const router = useRouter();
  const modalRef = useRef<ElementRef<typeof Dialog>>(null);
  const accountId = trpc.useMutation("account-check", {
    onSuccess: (data) => {
      router.push(`/store/preview/${data}`);
    },
  });
  const loginUser = trpc.useMutation("user-login", {
    onSuccess: (data) => {
      modalRef.current && modalRef.current.close();
      data.access_token && router.push("/store/me");
    },
  });
  const { register, handleSubmit } = useForm();
  const { register: register2, handleSubmit: submit } = useForm();

  const onSubmit = (data: any) => {
    accountId.mutate(data.instagram_id);
  };

  const openModalHandler = () => {
    modalRef.current && modalRef.current.open();
  };

  const loginHandler = (data: any) => {
    loginUser.mutate({
      phonenumber: data.phonenumber,
      password: data.password,
      // instagram_id: store,
    });
  };

  // gradiend bg from-[#ad5389] to-[#3c1053]

  return (
    <div className="w-full font-mono  relative flex flex-col items-center justify-center  h-screen from-base-100 to-base-300 bg-gradient-to-br">
      <header className="w-full p-6 fixed top-0 flex items-center justify-between">
        <h1 className="text-center text-4xl font-bold text-white font-mono">
          Magic Store
        </h1>
        {!getCookie("access_token") && (
          <button
            onClick={openModalHandler}
            className="btn btn-primary btn-outline"
          >
            Login
          </button>
        )}
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 form-control max-w-xl"
      >
        <label htmlFor="instagram_id" className="label">
          <span className="label-text font-bold text-xl">
            Enter Instagram id to see the Magic !
          </span>
        </label>
        <input
          type="text"
          id="instagram_id"
          disabled={accountId.isLoading}
          {...register("instagram_id", { required: true })}
          className="input input-bordered input-primary mt-2 w-[500px]"
          placeholder="ex:@mrdante"
        />
        <button
          disabled={accountId.isLoading}
          type="submit"
          className={clsx(
            "btn btn-primary mt-4 max-w-[80%] mx-auto text-lg capitalize",
            {
              loading: accountId.isLoading,
            }
          )}
        >
          start magic
        </button>
      </form>
      <Dialog
        title="Login"
        containerClassName="font-mono bg-base-300 !h-fit shadow shadow-purple-900"
        ref={modalRef}
      >
        <form
          className="form-control pb-4"
          onSubmit={submit(loginHandler)}
          autoComplete="off"
          autoSave="off"
        >
          <label htmlFor="instagram_id" className="label">
            <span className="label-text font-bold ">Phonenumber</span>
          </label>
          <input
            type="tel"
            id="phonenumber"
            disabled={loginUser.isLoading}
            {...register2("phonenumber", { required: true })}
            className="input "
            placeholder="enter your phonenumber"
          />
          <label htmlFor="password" className="label">
            <span className="label-text font-bold ">Password</span>
          </label>
          <input
            type="password"
            id="password"
            disabled={loginUser.isLoading}
            {...register2("password", { required: true })}
            className="input "
            placeholder="enter your password"
          />
          <button
            className="btn btn-primary mt-4"
            type="submit"
            disabled={loginUser.isLoading}
          >
            Login
          </button>
        </form>
      </Dialog>
    </div>
  );
};

export default Home;
