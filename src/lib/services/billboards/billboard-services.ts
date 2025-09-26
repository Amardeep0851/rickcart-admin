import { db } from "@/lib/db";
import { format } from "date-fns";

export const fetchBillboards = async (storeId:string, userId:string) => {
  const billboards = await db.billboard.findMany({
    where:{
      storeId:storeId,
      store:{
        userId
      }
    },
    orderBy:{
      createdAt:"desc"
    }
  });

  return await billboards.map((item) => ({
    id:item.id,
    title:item.title,
    link:item.link,
    imageUrl:item.imageUrl,
    buttonText:item.buttonText,
    status:item.status,
    createdAt:format(item.createdAt, "d LLL yyyy ")
  }))
}

export const bulkDeleteBillboards = (storeId: string, ids: string[]) => {
  return db.billboard.deleteMany({
    where: {
      storeId,
      id: {
        in: ids,
      },
    },
  });
};