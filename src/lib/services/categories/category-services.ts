import { db } from "@/lib/db";
import { Category } from "@prisma/client";

export const fetchAllCategories = (storeId:string):Promise<Category[] | null> => {
  return db.category.findMany({
    where:{
      storeId
    }
  })
}

export const fetchCategoryByIdAndSlug = async (storeId:string, slug:string):Promise<Category | null> => {
return await db.category.findFirst({
  where:{
    storeId,
    slug
  }
})
}

export const bulkDeleteCategories = async (storeId:string, ids:string[]) => {
  return db.category.deleteMany({
    where:{
      storeId,
      id:{
        in:ids
      }
    }
  })
}