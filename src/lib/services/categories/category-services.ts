import { db } from "@/lib/db";

export const fetchAllCategories = (storeId:string, userId:string) => {
  return db.category.findMany({
    where:{
      storeId,
      store:{
        userId
      }
    }
  })
}