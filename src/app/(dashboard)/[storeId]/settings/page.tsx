import React from 'react'
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server"

import { db } from "@/lib/db";
import SettingForm from "./components/setting-form";
import AlertApi from "@/components/ui/alert-api";


async function SettingPage({params}:{params:{storeId:string}}) {

  const {userId} = await auth();

  if(!userId){
    redirect("sign-in")
  }

  const store = await db.store.findFirst({
    where:{
      userId,
      id:params.storeId
    }
  });

  if(!store){
    redirect("/")
  }

  return (
    <div className="flex-1 py-16 mx-4 lg:mx-0 ">
      <div className="lg:w-6/12 m-auto border-2 border-zinc-200 dark:border-zinc-700 rounded-sm overflow-hidden">
      <SettingForm data={store} />
      </div>
      <div className="px-4 pt-6">
        <AlertApi />
      </div>
    </div>
  )
}

export default SettingPage