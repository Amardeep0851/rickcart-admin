import React from 'react'
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

import ProductForm from "../components/product-form";

import { getStoreByUserId } from "@/lib/services/store/store-services";
import { fetchProductWithId } from "@/lib/services/products/product-services";

async function BillboardIdPage({params}:{params:Promise<{storeId:string, productId:string}>}) {

  const {userId} = await auth();
  const {storeId, productId} = await params

  if(!userId){
    redirect("/sign-in")
  }

  const store = await getStoreByUserId(storeId, userId)

  if(!store){
    redirect("/")
  }

  const productData = await fetchProductWithId(storeId, productId)
  if(!productData){
    redirect(`/${storeId}/categories`)
  }
  return (
    <div className="md:w-8/12 mx-3 md:mx-auto my-4 border-2 rounded-sm">
      <ProductForm data={productData} />
    </div>
  )
}

export default BillboardIdPage