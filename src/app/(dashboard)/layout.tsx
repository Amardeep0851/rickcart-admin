import Navbar from "@/components/navbar/navbar";
import React from 'react';

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { useModel } from "@/hooks/use-store-model";

async function DashboardLayout({children}:{children:React.ReactNode}) {

  const {userId} = await auth();
 
  if(!userId){
    redirect("/sign-in")
  }
  const store = await db.store.findMany({
    where:{
      userId
    }
  })
  if(store.length === 0){
    redirect("/")
  }
  return (
    <div>
      <Navbar items={store} />
      {children}
    </div>
  )
}

export default DashboardLayout