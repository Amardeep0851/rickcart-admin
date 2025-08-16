import React from 'react'
import BillboardForm from "../components/billboard-form"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

async function BillboardIdPage({params}:{params:Promise<{storeId:string, billboardId:string}>}) {

  const {userId} = await auth();
  const {storeId, billboardId} = await params

  if(!userId){
    redirect("/sign-in")
  }

  const store = await db.store.findFirst({
    where:{
      id:storeId,
      userId
    }
  });

  if(!store){
    redirect("/")
  }

  const billboardData = await db.billboard.findFirst({
    where:{
      storeId,
      id:billboardId
    }
  })
  if(!billboardData){
    redirect(`/${storeId}/billboard`)
  }
  return (
    <div>
      <BillboardForm data={billboardData} />
    </div>
  )
}

export default BillboardIdPage