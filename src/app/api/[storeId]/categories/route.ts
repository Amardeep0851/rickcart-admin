import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ApiResponse } from "@/lib/ApiResponse";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { name, billboardId, status} = await req.json();
    const {storeId} = await params;

    if (!userId) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Image is required.", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("StoreId is required.", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required.", { status: 400 });
    }

    const createdCategory = await db.category.create({
      data: {
        storeId:storeId,
        name,
        status,
        billboardId,
        slug:""
      },
    });

    return NextResponse.json(new ApiResponse(200, createdCategory, "Category is created successfully."));

  } catch (error) {
    console.error("[CREATING_BILLBOARD_ERROR]", error);
    return new NextResponse("An unexpected error occurred. Please try again later.",{status:500})
  }
}
