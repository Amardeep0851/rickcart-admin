import React from 'react'
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

import CategoryForm from "../components/option-form";

import { getStoreByUserId } from "@/lib/services/store/store-services";
import { fetchOptionWithId } from "@/lib/services/options/options-services";

async function BillboardIdPage({params}:{params:Promise<{storeId:string, optionId:string}>}) {

  const {userId} = await auth();
  const {storeId, optionId} = await params

  if(!userId){
    redirect("/sign-in")
  }

  const store = await getStoreByUserId(storeId, userId)

  if(!store){
    redirect("/")
  }

  const optionData = await fetchOptionWithId(storeId, optionId)
  if(!optionData){
    redirect(`/${storeId}/categories`)
  }
  return (
    <div className="md:w-8/12 mx-3 md:mx-auto my-4 border-2 rounded-sm">
      <CategoryForm data={optionData} />
    </div>
  )
}

export default BillboardIdPage