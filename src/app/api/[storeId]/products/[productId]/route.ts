import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import slugify from "slugify";

import { 
  deleteProdcut,
  fetchProductWithId,
  fetchSlugAndStoreId,
  updateProduct,
} from "@/lib/services/products/product-services";

import { formSchema } from "@/lib/services/products/product-schema";


export async function GET(
  req:Request, 
  {params}:{params:Promise<{storeId:string; productId:string}>}
){

  // --------------------------- Import to read ------------------------------
  //Here we are using directly productID instead of slug. But we are fetchign data with slug not productId because that is also unique.

  try {
    const {productId, storeId} = await params;
    if(!productId){
      return new NextResponse("Product ID is required.",{status:400})
    }
    if(!storeId){
      return new NextResponse("Store ID is required.",{status:400})
    }

    const response = await fetchSlugAndStoreId(storeId, productId);
    return NextResponse.json({data:response}, {status:200})
  } catch (error) {
    console.error("[BACKEND_PRODUCT_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, productId } = await params;
    const slug = slugify(body.name, {
      lower: true,
      strict: true, // remove special characters
    });

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if(!storeId){
      return new NextResponse("StoreId is required.",{status:400})
    }
    if(!productId){
      return new NextResponse("ProductId is required.", {status:400})
    }
    
    const validatedBody = formSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json(validatedBody.error.issues[0].message, {
        status: 400,
      });
    }

    const isSlugAndStoreIdSame = await fetchSlugAndStoreId(storeId, slug);
    const product = await fetchProductWithId(storeId, productId);
    if (product?.userId !== userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (isSlugAndStoreIdSame && product?.slug !== slug) {
      return NextResponse.json(
        "This title is already in use. Please choose something else.",
        { status: 400 }
      );
    }

    let changedFields: Record<string, unknown> = {};
    const oldData = {
      comparePrice: product.comparePrice,
      costPrice: product.costPrice,
      description: product.description,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      lowStockAlert: product.lowStockAlert,
      metaDescription: product.metaDescription,
      metaTitle: product.metaTitle,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      trackQuantity: product.trackQuantity,
    };

    const newData = {
      comparePrice: validatedBody.data.comparePrice,
      costPrice: validatedBody.data.costPrice,
      description: validatedBody.data.description,
      isActive: validatedBody.data.isActive,
      isFeatured: validatedBody.data.isFeatured,
      lowStockAlert: validatedBody.data.lowStockAlert,
      metaDescription: validatedBody.data.metaDescription,
      metaTitle: validatedBody.data.metaTitle,
      name: validatedBody.data.name,
      price: validatedBody.data.price,
      quantity: validatedBody.data.quantity,
      trackQuantity: validatedBody.data.trackQuantity,
    };

    for (const key in newData) {
      if (
        newData[key as keyof typeof newData] !==
        oldData[key as keyof typeof oldData]
      ) {
        changedFields[key] = newData[key as keyof typeof newData];
      }
    }

    //--start-- adding category if it is chagned.
    if (validatedBody.data.categoryId !== product.category.id) {
      changedFields.category = {
        connect: {
          id: validatedBody.data.categoryId,
        },
      };
    }
    //--end--

    //--start-- adding options, it they has changed.
    const newIds = validatedBody.data.options.map((option) => option.value);
    const existingIds = product.options.map((option) => option.id);
    const toConenct = newIds
      .filter((id) => !existingIds.includes(id))
      .map((id) => ({ id }));
    const toDisconnect = existingIds
      .filter((id) => !newIds.includes(id))
      .map((id) => ({ id }));

    if (!!toConenct.length || !!toDisconnect.length) {
      changedFields.productOptions = {
        connect: toConenct,
        disconnect: toDisconnect,
      };
    }
    //--end--

    //--start-- adding images, it is updating.
    const newImages = validatedBody.data.images;
    const existingImage = product.images.map((image) => image.url);
    const toCreate = newImages
      .filter((url) => !existingImage.includes(url))
      .map((url) => ({ url }));
    const toDelete = existingImage.filter((url) => !newImages.includes(url));

    if (!!toCreate.length || !!toDelete.length) {
      changedFields.images = {
        create: toCreate,
        deleteMany: {
          url: { in: toDelete },
        },
      };
    }
    //--end--

    //--start-- adding tags, it is updating.
    changedFields.tags = validatedBody.data.tags;
    //--end--

    const response = await updateProduct( changedFields, product.id, slug, storeId, userId );
    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error) {
    console.error("[BACKEND_PRODUCT_PATCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req:Request, {params}:{params:Promise<{productId:string, storeId:string}>}){
  try {
    const { userId } = await auth();
    const { storeId, productId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if(!storeId){
      return new NextResponse("StoreId is required.",{status:400})
    }
    if(!productId){
      return new NextResponse("ProductId is required.", {status:400})
    }

    const product = await fetchProductWithId(storeId, productId);
    if(!product){
      return NextResponse.json("Product is not found. please try again.", { status: 401 });
    }
    if (product?.userId !== userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    
    const response  = await deleteProdcut(productId, storeId);
    return NextResponse.json({data:response}, {status:200})
  } catch (error) {
    console.error("[BACKEND_PRODUCT_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

