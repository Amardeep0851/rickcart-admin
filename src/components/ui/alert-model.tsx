import React from "react";
import Model from "./model";
import { Button } from "./button";

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
        <Button
          onClick={onClose}
          size="sm"
          disabled={disabled}
          variant="default"
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={onComfirm}
          size="sm"
          disabled={disabled}
          variant="destructive"
          className="cursor-pointer"
        >
          Continue
        </Button>
      </div>
    </Model>
  );
}

export default AlertModel;
