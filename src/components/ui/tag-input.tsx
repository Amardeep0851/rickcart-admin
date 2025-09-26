"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

type TagsInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
};

export default function TagsInput({ value, onChange, disabled }: TagsInputProps) {
  const [singleTag, setSingleTag] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue.endsWith(",")) {
      const newTag = inputValue.slice(0, -1).trim();
      if (newTag) {
        onChange([...(value || []), newTag]); // ✅ update parent
      }
      setSingleTag("");
    } else {
      setSingleTag(inputValue);
    }
  };

  const handleDelete = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      <Input
        onChange={handleChange}
        value={singleTag}
        disabled={disabled}
        placeholder="Enter tags and press comma..."
        className="focus-visible:border-[2px]/10 focus-visible:ring-0 focus-visible:outline-0"
      />
      <div className="flex gap-2 mt-2 flex-wrap">
        {value.map((tag, index) => (
          <span
            key={index}
            onClick={() => handleDelete(index)}
            className="px-3 py-1 bg-zinc-200 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-700 rounded-md text-sm cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
