"use client";
import { ColumnDef } from "@tanstack/react-table";
import BillboardCellAction from "./billboard-cell-action";
import Image from "next/image";
import { Check, Link, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
export interface BillboardDataProps {
  id: string;
  title?: string | null;
  link?: string | null;
  imageUrl: string;
  buttonText?: string | null;
  createdAt: string;
  status: boolean;
}

export const columns: ColumnDef<BillboardDataProps>[] = [
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
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-28">
        <Image
          src={row.original.imageUrl}
          alt="Billboard Image"
          width="200"
          height="33"
          className="w-[100px] h-[33px] rounded-sm object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="w-36 whitespace-normal break-words md:w-48 lg:w-full lg:whitespace-nowrap">{row.original.title ? row.original.title : null}</div>
    ),
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => (
      <div className="">
        {row.original.link ? (
          <Link className="w-4 h-4" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "buttonText",
    header: () => <div className="text-center">Button Text</div>,
    cell: ({ row }) => (
      <div className=" flex justify-center ">
        {row.original.buttonText ? (
          <Badge variant="secondary">{row.original.buttonText}</Badge>
        ) : (
          <Minus className="w-4 h-4" />
        )}
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
