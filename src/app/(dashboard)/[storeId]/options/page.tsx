import React from 'react'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import ClientComponent from "./components/client-component"
import { fetchAllOptionsWithValue } from "@/lib/services/options/options-services";

async function OptionsPage({params}:{params:Promise<{storeId:string}>}) {
  const {userId} = await auth()
  const {storeId }= await params

  if(!userId){
    redirect("/sign-in")
  }

  const formattedData = await fetchAllOptionsWithValue(storeId, userId);

  return (
    <div className="px-4">
      <ClientComponent Data={formattedData}  />
    
    </div>
  )
}

export default OptionsPage