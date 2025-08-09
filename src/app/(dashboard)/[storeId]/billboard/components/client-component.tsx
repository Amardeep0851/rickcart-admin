"use client"
import React from 'react';
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageHeading from "@/components/ui/page-heading";
import DataTable from "./data-table";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";


function ClientComponent() {

  const router = useRouter();
  const params = useParams()
  return (
    <div>
      <div className="flex justify-between pt-4 pb-4">
        <PageHeading 
        title="Billboard" 
        description="Manage all the billboards displayed in your store. You can create new billboards, edit existing ones, or remove those that are no longer needed." />
        <Button 
          className="cursor-pointer" 
          onClick={() => router.push(`/${params.storeId}/billboard/new`)} >
          <PlusCircle /> Add New
        </Button>
      </div>
      <Separator />
      <div className="pt-4">
        <DataTable />
      </div>
    </div>
  )
}

export default ClientComponent