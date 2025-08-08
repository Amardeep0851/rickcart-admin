import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function PATCH(
  req:Request, 
  {params}: { params: Promise<{ storeId: string }> }){

  try {
    const {userId} = await auth();
    const {name} = await req.json();
    const {storeId} = await params


    if(!userId){
      return new NextResponse("Unauthorized", {status:401})
    }
    
    if(!name){
      return new NextResponse("Name is required.", {status:400})
    }

    if(!storeId){
      return new NextResponse("StoreId is required.", {status:400})
    }
    const store = await db.store.update({
      where:{
        userId,
        id:storeId
      },
      data:{
        name
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", {status:500})
  }

}

export async function DELETE(
  req:Request, 
  {params}: { params: Promise<{ storeId: string }> }){

  try {
    const {userId} = await auth();
    const {storeId} = await params


    if(!userId){
      return new NextResponse("Unauthorized", {status:401})
    }

    if(!storeId){
      return new NextResponse("StoreId is required.", {status:400})
    }

    const userStore = await db.store.findFirst({
      where:{
        userId,
        id:storeId
      }
    });

    if(!userStore){
      return new NextResponse("Unauthorized", { status: 403 })
    }
    const store = await db.store.delete({
      where:{
        id:storeId
      }
    })

    
    return NextResponse.json(store)
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", {status:500})
  }

}