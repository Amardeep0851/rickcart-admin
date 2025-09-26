"use client";

import Image from "next/image";
import axios from "axios";
import { useParams } from "next/navigation";
import { ImagePlus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";

import { Button } from "./button";
import { cn } from "@/lib/utils";
import { PlaceholderImage } from "./PlaceholderImage";

export enum ImageType {
  PRODUCT,
  BILLBOARD,
}

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
  imageUrl?: string;
  multiple?: boolean;
  maxfile?: 1 | 8 | 5;
  imageType: ImageType;
}

function ImageUpload({
  value,
  onChange,
  disabled,
  multiple = false,
  maxfile = 1,
  imageType,
}: ImageUploadProps) {
  const [urlState, setUrlState] = useState<string[]>(value ?? []);
  const params = useParams();

  useEffect(() => {
    onChange(urlState);
  }, [urlState]);

  const onSuccess = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info;

    if (info && typeof info !== "string" && info.secure_url) {
      setUrlState((prev) => [...prev, info.secure_url]);
    }
  };

  const onDeleteImageFromCloudniary = async (imageUrl: string) => {
    try {
      let publicId;
      if (imageUrl) {
        const PublicIdWithFormat = imageUrl.split("/").pop();
        publicId = PublicIdWithFormat?.split(".")[0];
      }

      const response = await axios.post(
        `/api/${params.storeId}/cloudinary/${publicId}/`
      );
      if (response?.data?.success === true) {
        const updated = value.filter((url: string) => url !== imageUrl);
        onChange(updated);
        setUrlState(updated);
      }
    } catch (error) {
      console.log("[DELETING_CLOUDINARY_IMAGE]", error);
    }
  };
  return (
    <div className="relative">
      {value?.map((url, index) => {
        return (
          <div className="rounded-sm relative inline-grid mr-4" key={index}>
            <div className="p-1 bg-red-900 rounded-sm hover:bg-red-800 active:bg-red-900 transition-all duration-100 absolute -right-2 -top-2 p cursor-pointer">
              <Trash2
                className="h-4 w-4"
                onClick={() => onDeleteImageFromCloudniary(url)}
              />
            </div>

            <Image
              src={url}
              width="200"
              height="67"
              alt="image"

              className={cn(
                "rounded-sm object-cover border-2 border-zinc-500",
                imageType === ImageType.BILLBOARD && "w-[200px] h-[67px]",
                imageType === ImageType.PRODUCT && " w-[150px] h-[150px]"
              )}
            />
          </div>
        );
      })}

      <CldUploadWidget
        onSuccess={onSuccess}
        options={{
          multiple: multiple,
          maxFiles: maxfile,
          resourceType: "image",
        }}
        uploadPreset="rickcart-admin"
      >
        {({ open }) => {
          return (
            value.length === 0 && (
              <div>
                <PlaceholderImage type={imageType} className="pb-4" />
                <Button
                  onClick={() => open()}
                  className="cursor-pointer "
                  type="button"
                  variant="default"
                  disabled={disabled}
                >
                  <ImagePlus className="w-4 h-4" />
                  Upload an Image
                </Button>
              </div>
            )
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUpload;
