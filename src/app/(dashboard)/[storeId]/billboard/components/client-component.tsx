"use client"
import React from 'react';
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Billboard } from "@prisma/client";

import DataTable from "./data-table";
import { columns, BillboardDataProps as dataProps } from "./coulmn";
import { Button } from "@/components/ui/button";
import PageHeading from "@/components/ui/page-heading";
import { Separator } from "@/components/ui/separator";

interface BillboardDataProps{
  BillboardData:dataProps[]
}

function ClientComponent({BillboardData}:BillboardDataProps) {

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
        <DataTable data={BillboardData} columns={columns} />
      </div>
    </div>
  )
}

export default ClientComponent