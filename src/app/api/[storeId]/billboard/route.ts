import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { imageUrl, title, buttonText, link } = await req.json();


    if (!userId) {
      return new NextResponse("Unauthorized access.", { status: 401 });
    }

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

    return NextResponse.json({ createdBillboard, status: 200, message:"Billboard is created successfully." });
  } catch (error) {
    console.error("[CREATING_BILLBOARD_ERROR]", error);
    return new NextResponse("An unexpected error occurred. Please try again later.",{status:500})
  }
}
