import { db } from "@/lib/db";
import {
  FormProductProps,
  ProductDataProps,
  ProductInputProps,
} from "./product-types";
import { Prisma } from "@prisma/client";

export const fetchAllProductsWithValue = async (
  storeId: string,
) => {
  const data = await db.product.findMany({
    where: {
      storeId,
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
    lowStockAlert: item.lowStockAlert,
    isActive: item.isActive,
    isFeatured: item.isFeatured,
    images: item.images,
    options: item.productOptions,
    category: item.category,
    slug:item.slug
  }));

  return formattedData;
};

export async function fetchProductWithId(
  storeId: string,
  id: string
): Promise<FormProductProps | null> {
  const data = await db.product.findFirst({
    where: { storeId, id },
    include: {
      images: true,
      productOptions: { include: { values: true } },
      category: true,
    },
  });

  if (!data) {
    return null;
  }
  return {
    ...data,

    id: data.id,
    name: data.name,
    description: data?.description,
    price: data.price?.toNumber() ?? null,
    comparePrice: data?.comparePrice?.toNumber() ?? null,
    costPrice: data?.costPrice?.toNumber() ?? null,
    quantity: data.quantity,
    trackQuantity: data.trackQuantity,
    lowStockAlert: data.lowStockAlert,
    isActive: data.isActive,
    isFeatured: data.isFeatured,
    images: data.images,
    options: data.productOptions,
    category: data.category,
    metaTitle: data.metaTitle,
  };
}

//This function is used in two places. One is while getting a single product to show in the front, and second is while updating product in productID/route.ts

export const fetchSlugAndStoreId = async (storeId: string, slug: string) => {
  return await db.product.findUnique({
    where: {
      storeId_slug: {
        storeId,
        slug,
      },
    },
    include:{
      images:true,
      category:true,
      productOptions:true
    }
  });
};

export const createProduct = async (
  body: ProductInputProps,
  slug: string,
  storeId: string,
  userId: string
) => {
  const modifiedData: Prisma.ProductCreateInput = {
    ...body,
    productOptions: {
      connect: body.options.map((option: { label: string; value: string }) => ({
        id: option.value,
      })),
    },
    images: {
      create: body.images.map((url: string) => ({ url })),
    },
    category: {
      connect: { id: body.categoryId },
    },
    slug,
    userId,
    store: {
      connect: {
        id: storeId,
      },
    },
  };
  delete (modifiedData as any).options;
  delete (modifiedData as any).categoryId;
  delete (modifiedData as any).storeId;

  return await db.product.create({ data: modifiedData });
};

export const updateProduct = async (
  body: any,
  id: string,
  slug: string,
  storeId: string,
  userId: string
) => {
  console.log(body);

  const modifiedData: Prisma.ProductUpdateInput = { ...body };

  return await db.product.update({
    where: {
      store: {
        id: storeId,
      },
      userId,
      id,
    },
    data: {
      ...modifiedData,
    },
  });
};

export const deleteProdcut = async (id: string, storeId: string) => {
  return await db.product.delete({
    where: {
      id,
      store: {
        id: storeId,
      },
    },
  });
};
