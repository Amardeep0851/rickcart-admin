import { NextResponse } from "next/server";

import { 
  createUser, 
  fetchAccountWithEmail, 
  updateNotVerifiedUser, 
} 
from "@/lib/services/auth/auth-service";

import { 
  generateExpireDate, 
  generateOtp, 
  hashPassword 
} from "@/lib/utils";

import { sendMail } from "@/lib/send-mail";
import { registerSchema } from "@/lib/services/auth/schema";

export async function POST(req:Request){
  try {
    const body = await req.json();
    const validatedData = registerSchema.safeParse(body);
    
    if(!validatedData.success){
      return new NextResponse(validatedData.error.issues[0].message, {status:400})
    }

    const checkExistAccount = await fetchAccountWithEmail(body.email);
    if(checkExistAccount && checkExistAccount?.emailVerified === true){
      return new NextResponse("Email is already exist.",{status:409})
    }
    
    const hashedPassword2 = await hashPassword(body.password);
    const {password, ...rest} = await body;
    const otp = generateOtp()
    const expiresAt = generateExpireDate(10);
    let response;
    
    if(checkExistAccount && checkExistAccount?.emailVerified === false){
      response = await updateNotVerifiedUser({...rest, hashedPassword:hashedPassword2}, otp, expiresAt);
      sendMail(body.firstName, otp, body.email);
      if(response){
        const {hashedPassword, ...data} = response
        return NextResponse.json(data, {status:200})
      }
    }

    response = await createUser({...rest, hashedPassword:hashedPassword2}, otp, expiresAt);

    if(!response) {
      return new NextResponse("Internal Server Error.", {status:500})
    }

    sendMail(body.firstName, otp, body.email);
    const {hashedPassword, ...data} = response
    return NextResponse.json(data, {status:200})
  } catch (error) {
    console.log("[ERROR_REGISTERING_USER]", error);
    return new NextResponse("Internal Error.",{status:500})
  }
}