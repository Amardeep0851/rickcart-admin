import React from 'react'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {format} from "date-fns"

import { db } from "@/lib/db";
import ClientComponent from "./components/client-component"

async function BillboardPage({params}:{params:Promise<{storeId:string}>}) {
  const {userId} = await auth()

  if(!userId){
    redirect("/sign-in")
  }
  const billboards = await db.billboard.findMany({
    where:{
      storeId:(await params).storeId,
      store:{
        userId
      }
    },
    orderBy:{
      createdAt:"desc"
    }
  });

  const formattedData = billboards.map((item) => ({
    id:item.id,
    title:item.title,
    link:item.link,
    imageUrl:item.imageUrl,
    buttonText:item.buttonText,
    status:item.status,
    createdAt:format(item.createdAt, "d LLL yyyy ")
  }))
 

  return (
    <div className="px-4">
      <ClientComponent BillboardData={formattedData} />
    
    </div>
  )
}

export default BillboardPage