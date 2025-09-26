import React from 'react'
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

import ProductForm from "../components/product-form";

import { getStoreByUserId } from "@/lib/services/store/store-services";
import { fetchProductWithId } from "@/lib/services/products/product-services";
import { fetchAllOptionsWithValue } from "@/lib/services/options/options-services";
import { fetchAllCategories } from "@/lib/services/categories/category-services";

async function BillboardIdPage({params}:{params:Promise<{storeId:string, productId:string}>}) {

  const {userId} = await auth();
  const {storeId, productId} = await params
  
  if(!userId){
    redirect("/sign-in")
  }
  
  const store = await getStoreByUserId(storeId, userId)
  const options = await fetchAllOptionsWithValue(storeId, userId);
  const categories = await fetchAllCategories(storeId, userId);
  const productData = await fetchProductWithId(storeId, productId)
  
  const formattedOptins = options?.map((option) => ({
    value:option.id,
    label:option.name,
  }))
  
  const formattedCategories = categories?.map((category) => ({
    value:category.id,
    label:category.name,
  }))

  if(!store){
    redirect("/")
  }
  if(!productData){
    redirect(`/${storeId}/products`)
  }
  return (
    <div className="md:w-8/12 mx-3 md:mx-auto my-4 border-2 rounded-sm">
      <ProductForm data={productData} options={formattedOptins} categories={formattedCategories} />
    </div>
  )
}

export default BillboardIdPage