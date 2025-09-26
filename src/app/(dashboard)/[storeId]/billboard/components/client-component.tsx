"use client"
import axios from "axios";
import { toast } from "sonner";
import React, { useState } from 'react';
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import DataTable from "@/components/ui/data-table";
import { columns, BillboardDataProps as dataProps } from "./coulmn";
import { Button } from "@/components/ui/button";
import PageHeading from "@/components/ui/page-heading";
import { Separator } from "@/components/ui/separator";

interface BillboardDataProps{
  BillboardData:dataProps[]
}

function ClientComponent({BillboardData}:BillboardDataProps) {

  const router = useRouter();
  const params = useParams();
  const { storeId } = params;
  const [loading, setloading] = useState(false);

  const onDelete = async (ids: string[]) => {
    try {
      setloading(true);
      const response = await axios.post(`/api/${storeId}/billboard/bulk-delete`, {ids});

      if (response.status === 200) {
        toast.success(
          `${ids.length} ${
            ids.length > 1 ? "rows are " : "row is"
          }  deleted successfully.`
        );
        router.refresh();
      }

    } catch (error:any) {
      if(process.env.NODE_ENV === "development"){
        console.log("[DELETEING_BULK-PRODUCT]", error);
      }
      const message = error.response.data || "Something went wrong. Please try again.";
      toast.warning(message)
    } finally {
      setloading(false);
    }
  };
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
        <DataTable data={BillboardData} columns={columns} searchKey="title" onDelete={(ids) => onDelete(ids)} disabled={loading} />
      </div>
    </div>
  )
}

export default ClientComponent