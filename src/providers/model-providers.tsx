"use client"
import StoreModel from "@/components/models/store-model";
import React, { useEffect, useState } from 'react'

function ModelProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  },[])

  if(!mounted){
    return null
  }
  return (
    <StoreModel />
  )
}

export default ModelProvider