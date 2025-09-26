import { Category, Product, ProductImage, ProductOption, ProductOptionValue } from "@prisma/client";


// --start-- This type is used in form and data table.
export type ProductDataProps = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  costPrice: number | null;
  quantity: number;
  trackQuantity: boolean;
  lowStockAlert:number | null;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  options: (ProductOption & { values: ProductOptionValue[] })[];
  category: Category;
};

export interface FormProductProps extends ProductDataProps {
  metaTitle:string | null;
  metaDescription:string | null;
  tags:string[];
  slug:string;
  userId?:string;
} 

//--end--

//  --start-- This type is used in form.
// export type ProductProps = Product & {
//   images:ProductImage[];
//   productOptions:(ProductOption &{values:ProductOptionValue[]})[];
//   category:Category;
// }
//--end--

// --start-- This type is used in route.ts because it is different compared to above type.
export type ProductInputProps = {
  name: string;
  description?: string | null;
  price: number;
  comparePrice?: number | null;
  costPrice?: number | null;
  quantity: number;
  trackQuantity: boolean;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string; 
  options: { label: string; value: string }[]; 
  images: string[]; 
  
};

//--end--