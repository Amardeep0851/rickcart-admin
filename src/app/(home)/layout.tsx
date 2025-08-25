import React from 'react';

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

async function DashboardLayout({children}:{children:React.ReactNode}) {

  const {userId} = await auth();
  if(!userId){
    redirect("/sign-in")
  }
  const store = await db.store.findFirst({
    where:{
      userId
    }
  })
  if(store){
    redirect(`${store.id}`)
  }
  return (
    <>
      {children}
    </>
  );
}

export default DashboardLayout