import { trpc } from "@/util/trpc";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [instagram_id, setInstagram_id] = useState("");
  const hello = trpc.useQuery(["hello", { text: "qwe" }]);
  const test = trpc.useMutation(["get-instagram_id"]);

  const getId = () => {
    test.mutate(instagram_id);
    // console.log(instagram_id);
  };

  console.log(test?.data);

  return (
    <div className="w-full text-white relative flex flex-col items-center justify-center  h-screen bg-gradient-to-r from-[#ad5389] to-[#3c1053]">
      <header className="w-full p-6 fixed top-0">
        <h1 className="text-center text-4xl font-bold text-white font-mono">
          Magic Store
        </h1>
      </header>
      <div className="flex flex-col p-6  max-w-xl">
        {/* {hello.data && <div>{hello?.data.greeting}</div>} */}
        <label htmlFor="instagram_id" className="font-medium font-mono">
          Enter Instagram id to see the Magic !
        </label>
        <input
          type="text"
          disabled={hello.isLoading}
          name="instagram_id"
          value={instagram_id}
          onChange={(e) => setInstagram_id(e.target.value)}
          className="p-2 rounded-lg w-96 mt-2 text-slate-900"
          placeholder="ex:@mrdante"
        />
        <button
          onClick={getId}
          className="flex font-mono mx-auto mt-6 text-white  bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          start magic
        </button>
      </div>
    </div>
  );
};

export default Home;
