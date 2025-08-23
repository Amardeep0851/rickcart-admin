"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@radix-ui/react-checkbox";
import BillboardCellAction from "./cell-action";
import Image from "next/image";
import { Check, Link, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CategoryDataProps {
  id: string;
  name: string ;
  billboardId: string;
  billboardName:string | null;
  status:boolean;
  createdAt:string;
}

export const columns: ColumnDef<CategoryDataProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="w-28">
       {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "billboardId",
    header: "Billboard",
    cell: ({ row }) => (
      <div className="">
        {row.original.billboardName }
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className=" flex justify-center ">
        {row.original.status ? (
          <Badge variant="secondary" className="bg-emerald-700">
            <Check className="w-4 h-4" />
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-yellow-700">
            <Minus className="h-4 w-4" />
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="w-14">Action</div>,
    cell: ({ row }) => <BillboardCellAction rowData={row.original} />,
  },
];
