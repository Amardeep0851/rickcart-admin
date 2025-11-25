import { bulkDeleteOptions } from "@/lib/services/options/options-services";
import { NextResponse } from "next/server"

export async function POST(
  req:Request,
  {params}:{params:Promise<{storeId:string}>}
){
  try { 
    const {storeId} = await params;
    const {ids}:{ids?:string[]} = await req.json();

    if(!storeId){
      return new NextResponse("StoreId is required.", {status:400})
    }
    if(!ids || ids.length === 0){
      return new NextResponse("Zero row to delete data", {status:400})
    }

    const data = await bulkDeleteOptions(storeId, ids)
    return NextResponse.json(data)
    
  } catch (error) {
    console.error("[BULK_DELETE_OPTIONS_IDS]", error)
    return new NextResponse("Internal server error", {status:500})
  }
}