import React from 'react';
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import ProductForm from "../components/product-form";
import { fetchAllOptionsWithValue } from "@/lib/services/options/options-services";
import { fetchAllCategories } from "@/lib/services/categories/category-services";


async function NewOption({params}:{params:Promise<{storeId:string}>}) {
  const {storeId}= await params;
  const {userId} = await auth();
  if(!userId){
    redirect("/sign-in")
  }

  const options = await fetchAllOptionsWithValue(storeId, userId);
  const categories = await fetchAllCategories(storeId, userId);

  const formattedOptins = options?.map((option) => ({
    lable:option.name,
    value:option.id
  }))

  const formattedCategories = categories?.map((category) => ({
    lable:category.name,
    value:category.id
  }))

  return (
    <div className="md:w-8/12 mx-3 md:mx-auto my-4 border-2 rounded-sm">
      <ProductForm options={formattedOptins } categories={formattedCategories}   />
    </div>
  )
}

export default NewOption