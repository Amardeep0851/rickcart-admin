"use client"
import React from 'react';
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (

    <div className="relative w-7 h-8 flex items-center ">
      <Sun 
      className={cn("w-5 h-5 rounded-full cursor-pointer absolute rotate-0 scale-0 left-2 dark:block dark:rotate-90 dark:scale-100  transition-all duration-300 ", )} 
      onClick={() => setTheme("light")} /> 
    
      <Moon 
      className="w-5 h-5 cursor-pointer absolute left-2 rotate-0 dark:-rotate-180 dark:scale-0 transition-all duration-300 " 
      onClick={() => setTheme("dark")} /> 
    </div>
  )
}

export default ThemeToggle