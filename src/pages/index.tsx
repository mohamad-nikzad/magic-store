import { trpc } from "@/util/trpc";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";

const Home: NextPage = () => {
  const accountId = trpc.useMutation(["get-instagram_id"]);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    accountId.mutate(data.instagram_id);
  };

  console.log(accountId?.data);

  return (
    <div className="w-full text-white relative flex flex-col items-center justify-center  h-screen bg-gradient-to-r from-[#ad5389] to-[#3c1053]">
      <header className="w-full p-6 fixed top-0">
        <h1 className="text-center text-4xl font-bold text-white font-mono">
          Magic Store
        </h1>
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col p-6  max-w-xl"
      >
        <label htmlFor="instagram_id" className="font-medium font-mono">
          Enter Instagram id to see the Magic !
        </label>
        <input
          type="text"
          id="instagram_id"
          {...register("instagram_id", { required: true })}
          className="p-2 rounded-lg w-96 mt-2 text-slate-900"
          placeholder="ex:@mrdante"
        />
        <button
          type="submit"
          className="flex font-mono mx-auto mt-6 text-white  bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          start magic
        </button>
      </form>
    </div>
  );
};

export default Home;
