"use client"
import React from "react";
import Model from "./model";
import { Button } from "./button";
import { DialogClose } from "@/components/ui/dialog";

interface AlertModelProps {
  description: string;
  onClose: () => void;
  onComfirm: () => void;
  isOpen: boolean;
  title: string;
  disabled: boolean;
}

function AlertModel({
  description,
  title,
  isOpen,
  onClose,
  onComfirm,
  disabled,
}: AlertModelProps) {
  return (
    <Model
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex justify-end  gap-4">
       <DialogClose asChild>
         <Button
          onClick={onClose}
          size="sm"
          disabled={disabled}
          variant="default"
          className="cursor-pointer"
        >
          Cancel
        </Button>
       </DialogClose>
       <DialogClose asChild>
          <Button
            onClick={onComfirm}
            size="sm"
            disabled={disabled}
            variant="destructive"
            className="cursor-pointer"
          >
            Continue
          </Button>
        </DialogClose>
      </div>
    </Model>
  );
}

export default AlertModel;
