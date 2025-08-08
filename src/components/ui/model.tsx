import React from 'react';

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  } from "@/components/ui/dialog";

  interface ModelProps {
    title:string;
    description:string;
    isOpen:boolean;
    onClose:() => void;
    children:React.ReactNode;
  }

function Model({ title, description, isOpen, onClose, children }:ModelProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  
  return (
    <Dialog onOpenChange={onChange} open={isOpen} >
      <DialogContent className="py-4 px-4">
        <DialogHeader>
          <DialogTitle className="text-center pb-3 border-b-[1px]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm ">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default Model