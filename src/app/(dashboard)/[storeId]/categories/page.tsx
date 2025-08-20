import React from 'react'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {format} from "date-fns"

import { db } from "@/lib/db";
import ClientComponent from "./components/client-component"

async function CategoryPage({params}:{params:Promise<{storeId:string}>}) {
  const {userId} = await auth()
  const {storeId }= await params

  if(!userId){
    redirect("/sign-in")
  }
  const categories = await db.category.findMany({
    where:{
      storeId:storeId,
      store:{
        userId
      }
    },
    include:{
      billboard:true
    },
    orderBy:{
      createdAt:"desc"
    }
  });

  

  const formattedData = categories.map((item) => ({
    id:item.id,
    name:item.name,
    billboardId:item.billboardId,
    billboardName:item.billboard.title,
    status:item.status,
    createdAt:format(item.createdAt, "d LLL yyyy ")
  }))

  return (
    <div className="px-4">
      <ClientComponent Data={formattedData} />
    
    </div>
  )
}

export default CategoryPage