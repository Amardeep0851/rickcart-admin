"use client";

import { useEffect, useState } from "react";

function useOrigin() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  },[])

  if (!isMounted) {
    return null;
  }
  console.log(isMounted);
  
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  return origin;
}

export default useOrigin;
