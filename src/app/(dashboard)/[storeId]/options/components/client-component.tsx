"use client"
import React from 'react';
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import DataTable from "@/components/ui/data-table";
import { columns} from "./coulmn";
import { Button } from "@/components/ui/button";
import PageHeading from "@/components/ui/page-heading";
import { Separator } from "@/components/ui/separator";
import { OptionDataProps } from "@/lib/services/options/options-types";

interface CategoryDataProps{
  Data:OptionDataProps[];
}

function ClientComponent({Data}:CategoryDataProps) {

  const router = useRouter();
  const params = useParams()
  return (
    <div>
      <div className="flex justify-between pt-4 pb-4">
        <PageHeading 
        title="Category" 
        description="Manage all the categories displayed in your store. You can create new categories, edit existing ones, or remove those that are no longer needed." />
        <Button 
          className="cursor-pointer" 
          onClick={() => router.push(`/${params.storeId}/options/new`)} >
          <PlusCircle /> Add New
        </Button>
      </div>
      <Separator />
      <div className="pt-4">
        <DataTable data={Data} columns={columns} />
      </div>
    </div>
  )
}

export default ClientComponent