import React from 'react'
import StoreSwitcher from "./store-switcher"
import MainMenu from "./main-menu"
import ThemeToggle from "./theme-toggle"
import UserButton from "./user-button";
import { Store } from "@prisma/client";

interface NavbarProps {
items:Store[];
}

function Navbar({items}:NavbarProps) {
  return (
    <div className="flex items-center gap-x-3 px-4  h-14 border-b-2 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-600 text-base">  
    <StoreSwitcher items={items} />
    <MainMenu />
    <div className="ml-auto flex gap-x-3">
      <ThemeToggle />
      <UserButton />
    </div>
    </div>
  )
}

export default Navbar