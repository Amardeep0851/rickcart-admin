"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@radix-ui/react-checkbox";
import BillboardCellAction from "./cell-action";

import { OptionDataProps } from "@/lib/services/options/options-types";


export const columns: ColumnDef<OptionDataProps>[] = [
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
    accessorKey: "values",
    header: "Values",
    cell: ({ row }) => (
      <div className="">
        {row.original.values }
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="w-14">Action</div>,
    cell: ({ row }) => <BillboardCellAction rowData={row.original} />,
  },
];
