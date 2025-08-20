import React from 'react'
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CategoryForm from "../components/category-form";

async function BillboardIdPage({params}:{params:Promise<{storeId:string, categoryId:string}>}) {

  const {userId} = await auth();
  const {storeId, categoryId} = await params

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

  const billboardData = await db.category.findFirst({
    where:{
      storeId,
      id:categoryId
    }
  })
  if(!billboardData){
    redirect(`/${storeId}/categories`)
  }
  return (
    <div>
      <CategoryForm data={billboardData} />
    </div>
  )
}

export default BillboardIdPage