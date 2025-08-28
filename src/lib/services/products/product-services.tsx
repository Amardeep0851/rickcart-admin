import { db } from "@/lib/db";
import { ProductDataProps } from "./product-types";

export const fetchAllProductsWithValue = async (
  storeId: string,
  userId: string
) => {
  const data = await db.product.findMany({
    where: {
      storeId,
      userId,
    },
    include: {
      images: true,
      productOptions: {
        include: {
          values: true,
        },
      },
      category: true,
    },
  });

  const formattedData: ProductDataProps[] = data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item?.description,
    price: item.price?.toNumber() ?? null,
    comparePrice: item?.comparePrice?.toNumber() ?? null,
    costPrice: item?.costPrice?.toNumber() ?? null,
    quantity: item.quantity,
    trackQuantity: item.trackQuantity,
    isActive: item.isActive,
    isFeatured: item.isFeatured,
    images: item.images,
    options: item.productOptions,
    category: item.category,
  }));

  return formattedData;
};

export async function fetchProductWithId(storeId: string, id: string) {
  return await db.product.findFirst({
    where: {
      storeId,
      id,
    },
    include: {
      images: true,
      productOptions: {
        include: {
          values: true,
        },
      },
      category: true,
    },
  });
}
