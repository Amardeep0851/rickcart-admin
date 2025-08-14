import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req:Request,{ params }: { params: Promise<{ publicId: string }> }){
  
  try {
    const {userId} = await auth();
    if(!userId){
      return new NextResponse("Unauthrozied", {status:401})
    }

    const result = await cloudinary.api.delete_resources_by_prefix(`${(await params).publicId}`);
      const isDeleted = result?.deleted && Object.values(result.deleted).includes("deleted");

    if (isDeleted) {
      return NextResponse.json({
        success: true,
        message: "Image deleted successfully",
        deletedId: (await params).publicId
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Image not found or already deleted"
      }, { status: 404 });
    }
  } catch (error) {
    console.error("[DELETING_CLOUDINARY_IMAGE]",error);
    return new NextResponse("Internal server error", {status:500})
  } 
}