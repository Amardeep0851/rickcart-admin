import { db } from "@/lib/db";

export async function getStoreByUserId(storeId:string, userId:string){
  try {
    return await db.store.findFirst({
    where:{
      id:storeId,
      userId
    }
  });
  } catch (error) {
    console.error("[FETCHING_STORe]", error)
    throw new Error("Something went wrong. Please try again.")
  }
}