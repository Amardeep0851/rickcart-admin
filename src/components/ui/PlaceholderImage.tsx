import Image from "next/image";
import { cn } from "@/lib/utils"; // adjust to your project path
import { ImageType } from "./image-upload";


interface PlaceholderImageProps {
  type: ImageType;
  className?: string;
}

export function PlaceholderImage({ type, className }: PlaceholderImageProps) {
  let src = "/site-images/default.png";
  let width = 150;
  let height = 150;
  let ConditionalClassName;

  if (type === ImageType.PRODUCT) {
    src = "/site-images/product-image-1200-1200.png";
    width = 150;
    height = 150;
    ConditionalClassName="aspect-[1/1]  object-fill"
  } else if (type === ImageType.BILLBOARD) {
    src = "/site-images/billboard-size-1200-400.png";
    width = 200;
    height = 67;
    ConditionalClassName="aspect-[3/1] object-cover"
    
  }

  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      className={cn("rounded-sm ",ConditionalClassName, className)}
    />
  );
}
