"use client";
import React, { useState } from 'react';
import { Store } from "@prisma/client";
import { Check,  ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command";

import { useModel } from "@/hooks/use-store-model";
import { CommandSeparator } from "cmdk";
import { cn } from "@/lib/utils";

interface StoreSwitcherProps{
  items:Store[];
}

function StoreSwitcher({items}:StoreSwitcherProps) {

  const {onOpen} = useModel();
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const currentlySelectedStore = items.find((item) => params.storeId === item.id)

  const onSelectItem = (Id:string) => {
    setIsOpen(!isOpen)
    router.push(`/${Id}`)
  }

  return (
  <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
  <PopoverTrigger 
  onClick={() => setIsOpen(!isOpen)}
  className="flex items-center w-[200px] capitalize px-2 border-2 rounded-sm py-1 cursor-pointer dark:border-zinc-700 hover:shadow-sm dark:hover:shadow-zinc-700 ">

    <StoreIcon className="w-4 h-4 mr-2" /> 
    {currentlySelectedStore ? currentlySelectedStore.name : "Select Store"} 
    <ChevronsUpDown className="w-5 h-5 ml-auto opacity-60" />

  </PopoverTrigger>


  <PopoverContent className="w-[200px]  p-0  text-zinc-50 border-zinc-700">
    <Command className="">
      <CommandInput placeholder="Search Store" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>


        <CommandGroup heading="Stores" className="p-1">
          {
            items.map((item) => {
              return ( 
                <CommandItem
                  key={item.id} 
                  className={cn("bg-zinc-900 data-[selected=true]:bg-zinc-900 hover:bg-zinc-800 cursor-pointer my-0.5 data-[selected=true]:hover:bg-zinc-800 ",currentlySelectedStore?.id === item.id && "bg-zinc-700 hover:bg-zinc-700 data-[selected=true]:bg-zinc-700 data-[selected=true]:hover:bg-zinc-700 ")}
                  onSelect={() => onSelectItem(item.id)}>

                  <StoreIcon className="size-4" />
                  {item.name}
                  {currentlySelectedStore?.id === item.id && <Check className="ml-auto" /> }
                  
                </CommandItem>
              )
            })
          }
          <CommandSeparator className="my-1 border-[1px] " />
          <CommandItem  onSelect={() => onOpen()} className="cursor-pointer">
            <PlusCircle className="size-4" />  Create Store
          </CommandItem>
        </CommandGroup>


      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
  )
}

export default StoreSwitcher