"use client";
import React, { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./button";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useParams } from "next/navigation";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
  imageUrl?: string;
  multiple?: boolean;
  maxfile?: 1 | 8 | 5;
}

interface CloudinaryUploadInfo {
  secure_url?: string;
  public_id?: string;
  [key: string]: unknown;
}

interface CloudinaryUploadResult {
  event: string;
  info?: CloudinaryUploadInfo;
}

function ImageUpload({
  value,
  onChange,
  disabled,
  multiple = false,
  maxfile = 1,
}: ImageUploadProps) {
  const [urlState, setUrlState] = useState<string[]>(value ?? []);
  const params = useParams();

  useEffect(() => {
    onChange(urlState);
  }, [urlState, onChange]);


  const onSuccess = (result:CloudinaryUploadResult) => {
    const url = result?.info?.secure_url;
    if (url) {
      setUrlState((prev) => {
        const updated = [...prev, url];
        return updated;
      });
    }
  };


  const onDeleteImageFromCloudniary = async (imageUrl: string) => {
    try {
      let publicId
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
        setUrlState(updated)
    }
    } catch (error) {
      console.log("[DELETING_CLOUDINARY_IMAGE]", error);
    }
    }
  return (
    <div className="relative">
      {value?.map((url, index) => 
      {
        return(
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
            className="rounded-sm w-[200px] h-[67px] object-cover "
          />
        </div>)
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
                <Image
                  src="/site-images/billboard-size-1200-400.png"
                  height="67"
                  width="200"
                  alt=""
                  className="pb-4 rounded-sm w-[200px] h-[67px] object-cover"
                />
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
