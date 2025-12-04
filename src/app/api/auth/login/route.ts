import { NextRequest, NextResponse } from "next/server";
import { generateExpireDate } from "@/lib/utils";
import { createTokenPair, hashPassword, verifyPassword } from "@/lib/server-utils/utils";
import { 
  fetchUserWithEmail, 
  userUpdateSessionAndDeletePreviousSession 
} from "@/lib/services/auth/auth-service";

import { loginSchema } from "@/lib/services/auth/schema";

export async function POST(req:NextRequest){
  try {
    const data = await req.json();
    const validatedData = loginSchema.safeParse(data);
    console.log(validatedData);

    if(!validatedData.success) {
      return new NextResponse(validatedData.error.issues[0].message, {status:400})
    }
    
    const user = await fetchUserWithEmail(data.email);

    if(!user){
      return new NextResponse("User does not exist",{status:401})
    }

    const hashedPassword = await verifyPassword(user.hashedPassword, data.password);
    if(!hashedPassword){
      return new NextResponse("Incorrect Password.",{status:401})
    }
    const {token, hashedToken} =  createTokenPair();
    const expiresAt = generateExpireDate(20*24*60);
    const cookiesOptions = { httpOnly: true, secure: true, maxAge: 20*24*60*60, path:"/" }
    const responseUser = await userUpdateSessionAndDeletePreviousSession(user.id, hashedToken, expiresAt);
    if(!responseUser){
      return new NextResponse("Somethign went wrong. Please try again.",{status:500});
    }
    const response = NextResponse.json("data", {status:200});
    response.cookies.set("SessionToken", token, cookiesOptions);
    return response;
    
  } catch (error) {
    console.log("[LOGIN_ERROR]", error);
    return new NextResponse("Something went wrong. Please try again.",{status:500})
  }
}