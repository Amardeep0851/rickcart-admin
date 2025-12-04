import { db } from "@/lib/db";

export async  function fetchCartProducts(cart:string[]){
  return await db.product.findMany({
    where:{
      id:{
        in:cart
      }
    },
    include:{
      images:true,
      category:true
    }
  })
}