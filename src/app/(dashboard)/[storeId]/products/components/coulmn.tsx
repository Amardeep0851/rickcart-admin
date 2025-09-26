"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import BillboardCellAction from "./cell-action";

import { ProductDataProps} from "@/lib/services/products/product-types";
import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";


export const columns: ColumnDef<ProductDataProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="w-3">
        <Checkbox
      className="border-zinc-500"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
      </div>
    ),
    cell: ({ row }) => (
      <Checkbox
      className="border-zinc-500"
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
    header: () => (
      <div className="w-52 p-0 m-0 ">Name</div>
    ),
    cell: ({ row }) => (
      <div className="w-52 text-wrap">
      {row.original.name} 
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "price",
    header: () => (
      <div className="w-10 p-0 m-0  ">Price</div>
    ),
    cell: ({ row }) => (
      <div className="w-10 text-center">
        {row.original.price }
      </div>
    ),
    enableGlobalFilter: true,
  },
   {
    accessorKey: "comparePrice",
     header: () => (
      <div className="w-28  p-0 m-0 ">Compare price</div>
    ),
    cell: ({ row }) => (
      <div className="w-28 text-center">
        {row.original.comparePrice }
      </div>
    ),
    enableGlobalFilter: true,
  },
   {
    accessorKey: "costPrice",
     header: () => (
      <div className="w-20 p-0 m-0 ">Cost Price</div>
    ),
    cell: ({ row }) => (
      <div className="w-20 text-center">
        {row.original.costPrice }
      </div>
    ),
    enableGlobalFilter: true,
  },
   {
    accessorKey: "quantity",
     header: () => (
      <div className="w-16 p-0 m-0 ">Quantity</div>
    ),
    cell: ({ row }) => (
      <div className="w-16 text-center">
        {row.original.quantity }
      </div>
    ),
    enableGlobalFilter: true,
  },
   {
    accessorKey: "options",
     header: () => (
      <div className="w-16 p-0 m-0 text-center ">Options</div>
    ),
    cell: ({ row }) => (
      <div className="text-wrap text-center w-16">
        {row.original.options.map((option) => option.name).join(", ")}
      </div>
    )
  },
   {
    accessorKey: "category",
     header: () => (
      <div className="w-16 p-0 m-0 ">Category</div>
    ),
    cell: ({ row }) => (
      <div className="w-16 text-center">
        {row.original.category.name }
      </div>
    ),
    enableGlobalFilter: true,
  },
   {
    accessorKey: "lowStockAlert",
    header: () => (
      <div className="w-16 p-0 m-0 ">Low stock alert</div>
    ),
    cell: ({ row }) => (
      <div className=" text-center">
        {row.original.lowStockAlert }
      </div>
    ),
    enableGlobalFilter: true,
  },
   {
    accessorKey: "trackQuantity",
    header: () => (
      <div className="w-24 p-0 m-0 ">Track Quantity</div>
    ),
    cell: ({ row }) => (
      <div className="w-24 text-center">
         {
          row.original.trackQuantity
          ? <Badge variant="secondary" className="bg-emerald-600">
              <Check className="size-4" />
            </Badge> 
          : <Badge variant="secondary" className="bg-yellow-700">
              <Minus className="size-4" /> 
            </Badge>
        }
      </div>
    ),
    enableGlobalFilter: true,
  },
   {
    accessorKey: "isActive",
    header: () => (
      <div className="w-10 p-0 m-0 ">Active</div>
    ),
    cell: ({ row }) => (
      <div className="w-10 text-center">
        {
          row.original.isActive 
          ? <Badge variant="secondary" className="bg-emerald-600">
              <Check className="size-4" />
            </Badge> 
          : <Badge variant="secondary" className="bg-yellow-700">
              <Minus className="size-4" /> 
            </Badge>
        }
      </div>
    ),
    enableGlobalFilter: true,
  },
   {
    accessorKey: "isFeatured",
    header: () => (
      <div className="w-16 p-0 m-0">Featured</div>
    ),
    cell: ({ row }) => (
      <div className="w-16 text-center">
         {
          row.original.isFeatured
          ? <Badge variant="secondary" className="bg-emerald-600">
              <Check className="size-4" />
            </Badge> 
          : <Badge variant="secondary" className="bg-yellow-700">
              <Minus className="size-4" /> 
            </Badge>
        }
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    id: "actions",
    header: () => <div className="w-14">Action</div>,
    cell: ({ row }) => <BillboardCellAction rowData={row.original} />,
  },
];
