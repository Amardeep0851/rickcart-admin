import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, billboardId } = await params;
    const { imageUrl, title, buttonText, link, status } = await req.json();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("StoreId is required.", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("BillboardId is required.", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image is required.", { status: 400 });
    }
    if (!title) {
      return new NextResponse("Title is required.", { status: 400 });
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

    const updatedBillboard = await db.billboard.update({
      where: {
        storeId,
        id: billboardId,
      },
      data: {
        imageUrl,
        title,
        buttonText,
        link,
        status,
      },
    });
    console.log(updatedBillboard);
    return NextResponse.json({
      updatedBillboard,
      status: 200,
      message: "Billboard updated successfully.",
    });
  } catch (error) {
    console.log("[UPDATING BILLBOARD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, billboardId } = await params;
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("publicId");
    let deletedBillboard, isDeleted;

    console.log(publicId, storeId, billboardId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("StoreId is required.", { status: 400 });
    }

    if (!billboardId) {
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

    if (publicId) {
      const result = await cloudinary.api.delete_resources_by_prefix( `${publicId}` );
      isDeleted = result?.deleted && Object.values(result.deleted).includes("deleted");
    }
    if (isDeleted) {
      deletedBillboard = await db.billboard.delete({
        where: {
          id: billboardId,
          storeId,
        },
      });
    }
    else if(publicId){
      deletedBillboard = await db.billboard.delete({
        where: {
          id: billboardId,
          storeId,
        },
      });
    }

    return NextResponse.json({
      deletedBillboard,
      status: 200,
      message: "Billboard deleted successfully.",
    });
  } catch (error) {
    console.log("[DELETING BILLBOARD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
