import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import SettingForm from "./components/setting-form";
import AlertApi from "@/components/ui/alert-api";
import { Separator } from "@/components/ui/separator";

async function SettingPage({ params }: { params: Promise<{storeId:string}> }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("sign-in");
  }
  const {storeId} = await params
  const store = await db.store.findFirst({
    where: {
      userId,
      id: storeId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-1 py-16 mx-4 lg:mx-0 px-4 ">
      <div className="lg:w-8/12 m-auto border-2 mb-6 border-zinc-200 dark:border-zinc-700 rounded-sm overflow-hidden">
        <SettingForm data={store} />
      </div>
    <Separator className="lg:w-8/12" />
      <div className="pt-6 w-full  m-auto">
        <AlertApi
          title="NEXT_PUBLIC_APP_URL"
          description={`api/${storeId}`}
          variant="public"
        />
        
      </div>
    </div>
  );
}

export default SettingPage;
