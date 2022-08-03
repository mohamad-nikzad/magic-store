import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="w-full  h-screen bg-gradient-to-r from-[#ad5389] to-[#3c1053]">
      <header className="w-full flex p-6">
        <h1 className="text-center text-4xl font-bold text-white">
          Magic Store
        </h1>
      </header>
      <div className="bg-red-500 flex w-full h-fit">1</div>
    </div>
  );
};

export default Home;
