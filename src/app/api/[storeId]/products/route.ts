import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import slugify from "slugify";

import { formSchema } from "@/lib/services/products/product-schema";
import { createProduct, fetchAllProductsWithValue, fetchSlugAndStoreId } from "@/lib/services/products/product-services";

export async function POST( req: Request, { params }: { params: Promise<{ storeId: string }> } ) 
  {
  try {

    const { userId } = await auth();
    const body = await req.json();
    const {storeId} = await params;

    const slug = slugify(body.name, {
      lower: true,
      strict: true, // remove special characters
    });
    const validatedBody = formSchema.safeParse(body);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!validatedBody.success) {
      return NextResponse.json(validatedBody.error.issues[0].message, {
        status: 400,
      });
    }

    const isSlugAndStoreIdSame = await fetchSlugAndStoreId(storeId, slug)

    if(isSlugAndStoreIdSame){
      return NextResponse.json("This title is already in use. Please choose something else.", {status:400})
    }

    const response = await createProduct(body, slug, storeId, userId );

    return NextResponse.json({ data:response}, { status: 200 });
  } catch (error) {
    console.error("[BACKEND_PRODUCT_POST_WRROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function GET(req:Request, {params}:{params:Promise<{storeId:string}>}){
  try{

    const {storeId} = await params;
    if(!storeId){
      return new NextResponse("Store ID is required.")
    }
    
    const response = await fetchAllProductsWithValue(storeId);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[BACKEND_PRODUCT_GET_WRROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}