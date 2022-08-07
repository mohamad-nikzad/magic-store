/* eslint-disable @next/next/no-img-element */
import { trpc } from "@/util/trpc";
import { Product } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Store: NextPage = () => {
  const store = useRouter().query.store as string;

  const account = trpc.useQuery(["account-get", store], { enabled: false });
  useEffect(() => {
    !account.isFetched && account.refetch();
  }, [account]);

  console.log(account?.data);

  return (
    <div className="w-full font-mono  relative min-h-screen from-base-100 to-base-300 bg-gradient-to-br">
      <div className="navbar bg-base-300 shadow top-0 sticky z-10">
        <a className="btn btn-ghost normal-case text-xl">
          {account.data?.instagram_id || store}
        </a>
      </div>
      <div className="container p-6">
        <h2 className="mb-3 text-base font-medium">
          for making changes like editing/adding product info,title,price,... or
          changing your website name please login :)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {account?.data?.products &&
            account.data.products.map((product: Product) => (
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
                  {/* <p>{product.description}</p> */}
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
    </div>
  );
};

export default Store;
