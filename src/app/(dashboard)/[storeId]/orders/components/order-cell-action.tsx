"use client";

import React, { Fragment } from "react";
import { Eye, MoreVertical } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { OrderListDataProps } from "@/lib/services/orders/order-types";

interface RowDataProps {
  rowData: OrderListDataProps;
}

function OrderCellAction({ rowData }: RowDataProps) {
  const router = useRouter();
  const params = useParams();

  const dropdownMenuItems = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "View",
      onClick: () => router.push(`/${params.storeId}/orders/${rowData.id}`),
    },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="flex justify-center w-14" asChild>
        <MoreVertical className="w-4 h-4 cursor-pointer" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="dark:bg-zinc-800 py-0 px-0 rounded-sm mt-1"
      >
        {dropdownMenuItems.map((item, index) => (
          <Fragment key={item.label}>
            <DropdownMenuItem className="flex justify-start hover:outline-none hover:bg-none rounded-sm bg-transparent p-1 hover:bg-white focus-within:bg-white focus-visible:bg-white dark:hover:bg-zinc-800 dark:focus-within:bg-zinc-800 dark:focus-visible:bg-zinc-800">
              <div
                className="cursor-pointer flex justify-start items-center gap-x-1 w-full dark:hover:bg-zinc-700 hover:bg-zinc-100 pl-2 py-2 rounded-md duration-75 transition-all"
                onClick={item.onClick}
              >
                {item.icon} {item.label}
              </div>
            </DropdownMenuItem>

            {index < dropdownMenuItems.length - 1 && <Separator />}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OrderCellAction;
