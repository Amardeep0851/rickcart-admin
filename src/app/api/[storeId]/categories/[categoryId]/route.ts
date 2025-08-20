import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { ApiResponse } from "@/lib/ApiResponse";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; categoryId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, categoryId } = await params;
    const { billboardId, name,status } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("StoreId is required.", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("BillboardId is required.", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Image is required.", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Title is required.", { status: 400 });
    }

    const store = await db.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    const billboard = await db.billboard.findFirst({
      where: {
        id: billboardId,
        store:{
          userId
        },
      },
    });

    if (!store) {
      return new NextResponse("Store is not found.", { status: 400 });
    }
    
    if (!billboard) {
      return new NextResponse("billboard is not found.", { status: 400 });
    }

    const updatedCategory = await db.category.update({
      where: {
        storeId,
        id: categoryId,
      },
      data: {
        name,
        billboardId,
        status,
      },
    });
    return NextResponse.json(new ApiResponse(200, updatedCategory, "Category is updated successfully"));
  } catch (error) {
    console.log("[UPDATING CATEGORY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; categoryId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, categoryId } = await params;


    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("StoreId is required.", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("BillboardId is required.", { status: 400 });
    }

    const store = await db.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Store is not found.", { status: 400 });
    }

   
      const deletedCategory = await db.category.delete({
        where: {
          id: categoryId,
          storeId,
        },
      });

    return NextResponse.json(new ApiResponse(200, deletedCategory, "Category is deleted successfully."));
  } catch (error) {
    console.log("[DELETING_CATEGORY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
