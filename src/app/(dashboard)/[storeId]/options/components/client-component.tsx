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
import { OptionDataProps } from "@/lib/services/options/options-types";
import AlertModel from "@/components/ui/alert-model";
import { toast } from "sonner";

interface CategoryDataProps {
  Data: OptionDataProps[];
}

function ClientComponent({ Data }: CategoryDataProps) {
  const router = useRouter();
  const params = useParams();
  const { storeId } = params;
  const [loading, setloading] = useState(false);

  const onDelete = async (ids: string[]) => {
    try {
      setloading(true);
      const response = await axios.post(`/api/${storeId}/options/bulk-delete`, {ids});

      if (response.status === 200) {
        toast.success(
          `${ids.length} ${
            ids.length > 1 ? "rows are " : "row is"
          }  deleted successfully.`
        );
        router.refresh();
      }

    } catch (error) {
      console.log("[DELETEING_BULK-OPTIONS]", error);
      toast.warning("Something went wrong. Please try again.")
    } finally {
      setloading(false);
    }
  };
  return (
    <div>
      <div className="flex justify-between pt-4 pb-4">
        <PageHeading
          title="Category"
          description="Manage all the categories displayed in your store. You can create new categories, edit existing ones, or remove those that are no longer needed."
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/options/new`)}
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
