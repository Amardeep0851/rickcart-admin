import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function POST(req:Request){
try {
  const {userId} = await auth();
  const {name} = await req.json();

  if(!userId){
    return new NextResponse("Unauthorized access.",{status:401})
  }

  if(!name){
    return new NextResponse("Name cannot be empty.",{status:400})
  }

  const data = await db.store.create({
    data:{
      name,
      userId
    }
  })

  return NextResponse.json(data);
} catch (error) {
  console.error("[ERROR_CREATING_ERROR_BACKEND]", error)
  return new NextResponse("Something went wrong. Please try again.", {status:500})
}
}