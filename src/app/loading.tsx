import { Loader2 } from "lucide-react"
import React from 'react'

function loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader2 className="animate-spin size-6" />
    </div>
  )
}

export default loading