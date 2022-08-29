import prisma from "@/util/prisma";
import { getCookie } from "cookies-next";
import { z } from "zod";
import { createRouter } from "../createRouter";
import fs from "fs";
import path from "path";
import nodeFetch from "node-fetch";

const downloadFile = async function (
  url: string,
  filename: string,
  username: string
) {
  const response = await nodeFetch(url);
  const buffer = await response.buffer();
  const userDir = `public/images/${username}`;
  if (fs.existsSync(userDir)) {
    await fs.writeFile(
      path.join(process.cwd(), `${userDir}/${filename}`),
      buffer,
      () => console.log("finished downloading!")
    );
  } else {
    await fs.mkdirSync(userDir);
    await fs.writeFile(
      path.join(process.cwd(), `${userDir}/${filename}`),
      buffer,
      () => console.log("finished downloading!")
    );
  }
};

export const accountRouter = createRouter()
  .mutation("check", {
    input: z.string(),
    async resolve({ input }) {
      const oldAccount = await prisma.account.findUnique({
        where: {
          instagram_id: input,
        },
      });
      if (!oldAccount) {
        const formdata = new URLSearchParams();
        formdata.append("username", input);
        formdata.append(
          "sessionid",
          "54971174570%3A4t6YhdUsHsdyVj%3A27%3AAYfav4d2_ZJPI1CHxHWfnpFl9HaW54j99zFSw81n5Q"
        );
        const getUserIDRequest = await fetch(
          "https://instatest-sina.herokuapp.com/user/id_from_username",
          {
            method: "POST",
            body: formdata,
          }
        );
        const userID = await getUserIDRequest.text();
        console.log(userID, "sina");
        const formdataMedias = new URLSearchParams();
        formdataMedias.append("user_id", userID);
        formdataMedias.append("amount", "10");
        formdataMedias.append(
          "sessionid",
          "54971174570%3A4t6YhdUsHsdyVj%3A27%3AAYfav4d2_ZJPI1CHxHWfnpFl9HaW54j99zFSw81n5Q"
        );
        const getMediasRequest = await fetch(
          "https://instatest-sina.herokuapp.com/media/user_medias",
          {
            method: "POST",
            body: formdataMedias,
          }
        );
        const medias = await getMediasRequest.json();
        console.log(medias, "sina");
        // const res = await fetch("https://fakestoreapi.com/products?limit=10");
        // const fetchedProducts = await res.json();

        medias?.forEach(async (item: any, index: number) => {
          await downloadFile(
            item?.thumbnail_url || item.resources[0]?.thumbnail_url,
            `${item.id}.png`,
            input
          );
        });

        const newAccount = await prisma.account.create({
          data: {
            instagram_id: input,
            previewProducts: {
              createMany: {
                data: medias?.map((item: any, index: number) => {
                  return {
                    title: item.caption_text,
                    thumbnail_url: `http://localhost:3000/images/${input}/${item.id}.png`,
                  };
                }),
              },
            },
          },
        });
        return input;
      }
      return input;
    },
  })
  .query("get", {
    input: z.string(),
    async resolve({ input }) {
      const account = await prisma.account.findUnique({
        where: {
          instagram_id: input,
        },
        include: {
          previewProducts: true,
        },
      });
      return account;
    },
  });
