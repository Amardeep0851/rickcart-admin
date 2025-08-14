import React from 'react';
import { BillboardDataProps } from "./coulmn";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Edit, IdCard, MoreHorizontal, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface RowDataProps{
  rowData:BillboardDataProps
}

function BillboardCellAction({rowData}:RowDataProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex justify-center w-14">
        <MoreVertical className="w-4 h-4 cursor-pointer" />
      </DropdownMenuTrigger>


      <DropdownMenuContent align="end" className="bg-zinc-800 py-2 px-2 rounded-sm mt-1">

        <DropdownMenuItem className="flex justify-start border-2 border-transparent  hover:outline-none hover:border-2 hover:border-zinc-700 rounded-sm px-3 transition-all duration-100">
          <Button variant="ghost" className="cursor-pointer flex justify-start ">
            <Edit className="w-4 h-4 " /> edit
          </Button>
        </DropdownMenuItem>
        <Separator />
         <DropdownMenuItem className="flex justify-start border-2 border-transparent  hover:outline-none hover:border-2 hover:border-zinc-700 rounded-sm px-3 transition-all duration-100">
          <Button variant="ghost" className="cursor-pointer flex justify-start ">
            <Trash className="w-4 h-4 " /> Delete
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-start border-2 border-transparent  hover:outline-none hover:border-2 hover:border-zinc-700 rounded-sm px-3 transition-all duration-100">
          <Button variant="ghost" className="cursor-pointer flex justify-start ">
            <IdCard className="w-4 h-4 " /> Copy Id
          </Button>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BillboardCellAction