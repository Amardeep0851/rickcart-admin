"use client";

import { useEffect } from "react";

import { useModel } from "@/hooks/use-store-model";

const SetupPage = () => {
  const onOpen = useModel((state) => state.onOpen);
  const isOpen = useModel((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};
 
export default SetupPage;
