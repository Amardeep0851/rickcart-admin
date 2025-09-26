import slugify from "slugify";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { ApiResponse } from "@/lib/ApiResponse";
import { 
  fetchAllCategories, 
  fetchCategoryByIdAndSlug 
} from "@/lib/services/categories/category-services";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const {storeId} = await params;
    const slug = slugify(body.name, {
      lower:true, 
      strict:true
    })

    if (!userId) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (!body.billboardId) {
      return new NextResponse("Billboard is required.", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("StoreId is required.", { status: 400 });
    }

    if (!body.name) {
      return new NextResponse("Name is required.", { status: 400 });
    }

    const isSlugExisted = await fetchCategoryByIdAndSlug(storeId, slug)
    if(isSlugExisted){
      return new NextResponse("Name is already exist. Please try something else.", {status:400})
    }
    const createdCategory = await db.category.create({
      data: {
        storeId:storeId,
        ...body,
        slug,
      },
    });

    return NextResponse.json(new ApiResponse(200, createdCategory, "Category is created successfully."));

  } catch (error) {
    console.error("[CREATING_CATEGORY_ERROR]", error);
    return new NextResponse("An unexpected error occurred. Please try again later.",{status:500})
  }
}

export async function GET(req:Request,{params}:{params:Promise<{storeId:string}>}) {
  try {
    const { userId } = await auth();
    const {storeId} = await params;

    // if (!userId) {
    //   return new NextResponse("Unauthorized.", { status: 401 });
    // }

    if (!storeId) {
      return new NextResponse("StoreId is required.", { status: 400 });
    }
    const response = await fetchAllCategories(storeId)

    return NextResponse.json(response, {status:200});

  } catch (error) {
    console.error("[CREATING_CATEGORY_ERROR]", error);
    return new NextResponse("An unexpected error occurred. Please try again later.",{status:500})
  }
}
