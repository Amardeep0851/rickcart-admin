import React from 'react'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import ClientComponent from "./components/client-component"
import { fetchAllProductsWithValue } from "@/lib/services/products/product-services";


async function ProductPage({params}:{params:Promise<{storeId:string}>}) {
  const {userId} = await auth()
  const {storeId }= await params

  if(!userId){
    redirect("/sign-in")
  }

  const formattedData = await fetchAllProductsWithValue(storeId);

  return (
    <div className="px-4">
      <ClientComponent Data={formattedData}  />
    
    </div>
  )
}

export default ProductPage