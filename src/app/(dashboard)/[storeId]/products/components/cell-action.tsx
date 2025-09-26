"use client";
import axios from "axios";
import { toast } from "sonner";
import React, { Fragment, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Edit, Loader2, MoreVertical, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AlertModel from "@/components/ui/alert-model";
import { Separator } from "@/components/ui/separator";
import { ProductDataProps} from "@/lib/services/products/product-types";

interface RowDataProps {
  rowData: ProductDataProps;
}

function CategoryCellAction({ rowData }: RowDataProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  const handleEdit = () => {
    router.push(`/${params.storeId}/products/${rowData.id}`);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `/api/${params.storeId}/products/${rowData?.id}`
      );

      if (response.status === 200) {
        router.refresh();
        toast.success("Product is deleted successfully.");
        // router.push(`/${params.storeId}/categories/`);
      }
    } catch (error:any) {
      if(process.env.NODE_ENV === "development"){
        console.error("[FRONTEND_DELETING_PRODUCT_TABLE]", error)
      }
      const message = error.response.data || "Something went wrong. Please try again."
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rowData.id);
    toast.success(`"${rowData.name}" is copied.`);
  };

  const DropdownMenuItemArray = [
    {
      icon: <Edit className="w-4 h-4" />,
      label: "Edit",
      onClick: handleEdit,
    },
    {
      icon: <Trash className="w-4 h-4" />,
      label: "Trash",
      onClick: () => setIsOpen(true),
    },
    {
      icon: <Edit className="w-4 h-4" />,
      label: "Id Copy",
      onClick: handleCopy,
    },
  ];

  return (
    <>
      <AlertModel
        title={`Confirm Deletion of "${rowData?.name}"`}
        description={`Are you sure you want to permanently delete ${rowData?.name}? Once deleted, this information cannot be recovered. Please confirm your decision before proceeding.`}
        onClose={() => setIsOpen(false)}
        onComfirm={handleDelete}
        isOpen={isOpen}
        disabled={isDeleting}
      />
      {isDeleting ? (
        <Loader2 className="animate-spin size-4" />
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="flex justify-center w-14" asChild>
            <MoreVertical className="w-4 h-4 cursor-pointer" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="dark:bg-zinc-800 py-0 px-0 rounded-sm mt-1"
          >
            {DropdownMenuItemArray.map((item, index) => (
              <Fragment key={item.label}>
                <DropdownMenuItem 
                  className="flex justify-start hover:outline-none hover:bg-none rounded-sm bg-transparent p-1 hover:bg-white focus-within:bg-white focus-visible:bg-white dark:hover:bg-zinc-800 dark:focus-within:bg-zinc-800 dark:focus-visible:bg-zinc-800   "
                >

                  <div
                    className="cursor-pointer flex justify-start items-center gap-x-1 w-full dark:hover:bg-zinc-700 hover:bg-zinc-100 pl-2 py-2 rounded-md duration-75 transition-all "
                    onClick={item.onClick}
                  >
                    {item.icon} {item.label}
                  </div>

                </DropdownMenuItem>

                {index < DropdownMenuItemArray.length - 1 && <Separator />}

              </Fragment>
            ))}
          </DropdownMenuContent>
          
        </DropdownMenu>
      )}
    </>
  );
}

export default CategoryCellAction;
