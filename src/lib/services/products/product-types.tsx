import { Category, Product, ProductImage, ProductOption, ProductOptionValue } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type ProductDataProps = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  costPrice: number | null;
  quantity: number;
  trackQuantity: boolean;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  options: (ProductOption & { values: ProductOptionValue[] })[];
  category: Category;
};

export type ProductProps = Product & {
  images:ProductImage[];
  productOptions:(ProductOption &{values:ProductOptionValue[]})[];
  category:Category;
}