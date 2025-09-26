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
    const { imageUrl, title, buttonText, link } = await req.json();


    

    if (!imageUrl) {
      return new NextResponse("Image is required.", { status: 400 });
    }

    if (!title) {
      return new NextResponse("Title is required.", { status: 400 });
    }

    const createdBillboard = await db.billboard.create({
      data: {
        storeId: (await params).storeId,
        title,
        imageUrl,
        link,
        buttonText,
      },
    });

    return NextResponse.json(createdBillboard, {status: 200 });
  } catch (error) {
    console.error("[CREATING_BILLBOARD_ERROR]", error);
    return new NextResponse("An unexpected error occurred. Please try again later.",{status:500})
  }
}

export async function GET(req:Request, { params }: { params: Promise<{ storeId: string }> }) {
  try {
    const {userId} = await auth();
    const { storeId } = await params;

    if(!userId){
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if(!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    } 

    const data = await db.billboard.findMany({
      where: {
        storeId: storeId,
        store: {
          userId: userId
        }
      }
    });

    return NextResponse.json(new ApiResponse(200, data, "Billboards are fetched successfully"))
  } catch (error) {
    console.error("[ERROR_FETCHING_BILLBOARDS]", error);
    return NextResponse.json({ error: "Failed to fetch billboards" }, { status: 500 });
  }
  
}