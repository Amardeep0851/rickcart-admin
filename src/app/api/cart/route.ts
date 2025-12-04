import { NextRequest, NextResponse } from "next/server";
import { fetchCartProducts } from "@/lib/services/cart/cart-services";

export async function POST(req:NextRequest){
  try {
    const {cart} = await req.json();
    
    const idInCart = cart.map((item:{id:string, quantity:string}) => item.id);
    const data = await fetchCartProducts(idInCart)
    return NextResponse.json(data,{status:200})
  } catch (error) {
    console.log("[ERROR_WHILE_FETCHING_ORDER]",error);
    return new NextResponse("Internal Server Error",{status:500})
  }
}