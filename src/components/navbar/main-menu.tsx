"use client"
import React from 'react';
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

function MainMenu() {
  const params = useParams();
  const pathname = usePathname()

  const navLinks = [
  {
    route:`/${params.storeId}`,
    label:"Dashboard",
    active:pathname === `/${params.storeId}`
  },
  {
    route:`/${params.storeId}/settings`,
    label:"Settings",
    active:pathname.startsWith(`/${params.storeId}/settings`)
  },
  {
    route:`/${params.storeId}/categories`,
    label:"Categories",
    active:pathname.startsWith(`/${params.storeId}/categories`)
  
  },
  {
    route:`/${params.storeId}/billboard`,
    label:"Billboard",
    active:pathname.startsWith(`/${params.storeId}/billboard`)
  
  },
  {
    route:`/${params.storeId}/products`,
    label:"Product",
    active:pathname.startsWith(`/${params.storeId}/products`)
  
  },
  {
    route:`/${params.storeId}/options`,
    label:"Options",
    active:pathname.startsWith(`/${params.storeId}/options`)
  
  },
  {
    route:`/${params.storeId}/orders`,
    label:"Orders",
    active:pathname.startsWith(`/${params.storeId}/orders`)
  
  }
]
  return (
    <nav className="">
      {navLinks.map((link) => {
      return <Link 
      key={link.route} 
      href={link.route}
      className={cn("px-3 mx-1 pb-0.5  rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200", link.active && "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700")} >
        {link.label}
      </Link>
      } )}
    </nav>
  )
}

export default MainMenu
