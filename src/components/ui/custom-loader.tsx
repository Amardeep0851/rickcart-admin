import { cn } from "@/lib/utils"
import { Loader, Loader2 } from "lucide-react"
import React from 'react'

function CustomLoader({className}:{className?:string}) {
  return (
    <div><Loader2 className={cn("animate-spin w-4 h-4", className)} /></div>
  )
}

export default CustomLoader