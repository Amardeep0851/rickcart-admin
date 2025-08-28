"use client";

import axios from "axios";
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { columns } from "./coulmn";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import PageHeading from "@/components/ui/page-heading";
import { Separator } from "@/components/ui/separator";
import AlertModel from "@/components/ui/alert-model";
import { ProductDataProps } from "@/lib/services/products/product-types";
import { toast } from "sonner";

interface DataProps {
  Data: ProductDataProps[];
}

function ClientComponent({ Data }: DataProps) {
  const router = useRouter();
  const params = useParams();
  const { storeId } = params;
  const [loading, setloading] = useState(false);

  const onDelete = async (ids: string[]) => {
    try {
      setloading(true);
      const response = await axios.post(`/api/${storeId}/products/bulk-delete`, {ids});

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
          title="Products"
          description="Manage all the Products displayed in your store. You can create new Product, edit existing ones, or remove those that are no longer needed."
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
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
          disabled={loading}
        />
      </div>
    </div>
  );
}

export default ClientComponent;
