"use client";
import axios from "axios";
import { toast } from "sonner";
import qs from "query-string";
import React, { Fragment, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Edit, MoreVertical, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AlertModel from "@/components/ui/alert-model";
import { Separator } from "@/components/ui/separator";
import { BillboardDataProps } from "./coulmn";

interface RowDataProps {
  rowData: BillboardDataProps;
}

function BillboardCellAction({ rowData }: RowDataProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  const handleEdit = () => {
    router.push(`/${params.storeId}/billboard/${rowData.id}`);
  };

  const handleDelete = async () => {
    try {
      let publicId;

      setIsDeleting(true);
      if (rowData?.imageUrl) {
        const PublicIdWithFormat = rowData?.imageUrl.split("/").pop();
        publicId = PublicIdWithFormat?.split(".")[0];
      }

      const url = qs.stringifyUrl({
        url: `/api/${params.storeId}/billboard/${rowData?.id}`,
        query: {
          publicId,
        },
      });

      const response = await axios.delete(url);

      if (response.data.status === 200) {
        router.refresh();
        toast.success("Billboard deleted successfully.");
        router.push(`/${params.storeId}/billboard/`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rowData.id);
    toast.success(`"${rowData.title}" is copied.`);
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
        title={`Confirm Deletion of "${rowData?.title}"`}
        description={`Are you sure you want to permanently delete ${rowData?.title}? Once deleted, this information cannot be recovered. Please confirm your decision before proceeding.`}
        onClose={() => setIsOpen(false)}
        onComfirm={handleDelete}
        isOpen={isOpen}
        disabled={isDeleting}
      />
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
              <DropdownMenuItem className="flex justify-start hover:outline-none hover:bg-none rounded-sm bg-transparent p-1 hover:bg-white focus-within:bg-white focus-visible:bg-white dark:hover:bg-zinc-800 dark:focus-within:bg-zinc-800 dark:focus-visible:bg-zinc-800   ">
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
    </>
  );
}

export default BillboardCellAction;
