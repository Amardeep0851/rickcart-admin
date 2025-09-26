"use client"
import React, { useState } from 'react';
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import DataTable from "@/components/ui/data-table";
import { CategoryDataProps } from "@/lib/services/categories/type";
import { Button } from "@/components/ui/button";
import PageHeading from "@/components/ui/page-heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./coulmn";
import axios from "axios";

interface CategoryProps{
  Data:CategoryDataProps[];
}

function ClientComponent({Data}:CategoryProps) {

  const router = useRouter();
  const params = useParams();
  const { storeId } = params;
  const [loading, setloading] = useState(false);

  const onDelete = async (ids: string[]) => {
    try {
      setloading(true);
      const response = await axios.post(`/api/${storeId}/categories/bulk-delete`, {ids});

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
        console.log("[DELETEING_BULK-CATEGORY]", error);
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
        title="Category" 
        description="Manage all the categories displayed in your store. You can create new categories, edit existing ones, or remove those that are no longer needed." />
        <Button 
          className="cursor-pointer" 
          onClick={() => router.push(`/${params.storeId}/categories/new`)} >
          <PlusCircle /> Add New
        </Button>
      </div>
      <Separator />
      <div className="pt-4">
        <DataTable 
          data={Data} 
          columns={columns} 
          searchKey="name"
          onDelete={(ids) => onDelete(ids)}
          disabled={loading} />
      </div>
    </div>
  )
}

export default ClientComponent