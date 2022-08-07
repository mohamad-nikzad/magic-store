import { trpc } from "@/util/trpc";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const accountId = trpc.useMutation("account-check", {
    onSuccess: (data) => {
      router.push(`/store/${data}`);
    },
  });
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    accountId.mutate(data.instagram_id);
  };

  console.log(accountId?.data);

  // gradiend bg from-[#ad5389] to-[#3c1053]

  return (
    <div className="w-full font-mono  relative flex flex-col items-center justify-center  h-screen from-base-100 to-base-300 bg-gradient-to-br">
      <header className="w-full p-6 fixed top-0">
        <h1 className="text-center text-4xl font-bold text-white font-mono">
          Magic Store
        </h1>
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
    </div>
  );
};

export default Home;
