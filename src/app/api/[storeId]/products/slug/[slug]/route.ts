import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string; slug: string }> }
) {
  try {
    const { slug, storeId } = await params;
    if (!slug) {
      return new NextResponse("Invalid category request", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Invalid request", { status: 400});
    }
    const category= await db.category.findUnique({
      where: {
        storeId_slug: {
          storeId,
          slug,
        },
        status:true
      }
    });
    if(!category){
      return new NextResponse("Not Found.",{status:404})
    }
    const response = await db.product.findMany({
      where:{
        categoryId:category.id,
        isActive:true
      },
      include:{
        images:true,
        category:true
      }
    })
    if(!response){
      return new NextResponse("Something went wrong. Please try again.",{status:500})
    }
    return NextResponse.json(response, {status:200})
  } catch (error) {
    console.log("[FETCHING_CATEGORY_SLUG]", error);
    return new NextResponse("Internal Server Error.",{status:500})
  }
}
