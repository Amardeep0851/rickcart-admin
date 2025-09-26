import React from 'react'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {format} from "date-fns"

import { db } from "@/lib/db";
import ClientComponent from "./components/client-component"
import { fetchBillboards } from "@/lib/services/billboards/billboard-services";

async function BillboardPage({params}:{params:Promise<{storeId:string}>}) {
  const {userId} = await auth();
  const {storeId} = await params

  if(!userId){
    redirect("/sign-in")
  }
  const data = await fetchBillboards(storeId, userId)

  return (
    <div className="px-4">
      <ClientComponent BillboardData={data} />
    </div>
  )
}

export default BillboardPage