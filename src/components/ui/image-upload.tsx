"use client";
import React, { useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./button";
import { Cross, ImagePlus, Trash, Trash2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useParams } from "next/navigation";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  disabled: boolean;
}

function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [mounted, setMounted] = useState(false);
  const [publicId, setPublicId] = useState(null);
  const params = useParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const onSuccess = (result: any) => {
    setPublicId(result?.info?.public_id);
    onChange(result?.info?.secure_url);
  };
  console.log(publicId);

  const onDeleteImageFromCloudniary = async (id: string) => {
    const response = await axios.post(
      `/api/${params.storeId}/cloudinary/${publicId}/`
    );
    if (response?.data?.success === true) {
      onChange("");
      setPublicId(null);
    }
  };
  return (
    <div className="relative">
      {!!value.length && (
        <div className="rounded-sm relative inline-block">
          <div className="p-1 bg-red-900 rounded-sm hover:bg-red-800 active:bg-red-900 transition-all duration-100 absolute -right-2 -top-2 p cursor-pointer">
            <Trash2
              className="h-4 w-4"
              onClick={() => onDeleteImageFromCloudniary("id")}
            />
          </div>

          <Image
            src={value[0]}
            width="200"
            height="67"
            alt="image"
            className="rounded-sm w-[300px] h-[100px] object-cover "
          />
        </div>
      )}

      <CldUploadWidget
        onSuccess={(result) => {
          onSuccess(result);
        }}
        options={{
        multiple: false, 
        maxFiles: 1,     
        resourceType: "image",
        styles: {
        palette: {
          window: '#f5f5f5', // Changes the overall widget background
          sourceBg: '#e8f0fe',
          // ... other color options
        },
        // ... other styling options
      }
         
        }}
        uploadPreset="rickcart-admin"
      >
        {({ open }) => {
          return (
            !value.length && (
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
