import { deleteOtp, fetchAccountWithEmail, updateOtpForFailedAttempt } from '@/lib/services/auth/auth-service';
import { NextResponse } from "next/server";

export async function POST(req:Request){

  //check account exist with email or id and also unverified.
  //check if time expired of otp
  //check if attempts are excceded
  //check otp matched
  //if not matched send back error and update attempts

  try {
    const body:{value:string, email:string, id:string} = await req.json();

    if(Number(body.value) <= 6){
      return new NextResponse("OTP should be at least 6 digits.",{status:422})
    }

    const user =  await fetchAccountWithEmail(body.email);
    if(!user?.email){
      return new NextResponse("Email does not exist.",{status:404})
    }
    if(user?.email && user.emailVerified === true){
      return new NextResponse("Email is already in used. Please log in with password",{status:409})
    }

    if(user?.otps?.expiresAt < new Date()){
      return new NextResponse("Code expired. Please request a new one.",{status:400})
    }

    if(user?.otps?.failedAttempts >=3 ){
      return new NextResponse("Too many failed attempts. Please try again with Log In.",{status:400})
    }
    if(user.otps.otp !== body.value){
      const response = await updateOtpForFailedAttempt(user.id)
      return new NextResponse(`"Otp is not matched. You have left ${3 - response.failedAttempts} attempts"`,{status:401})
    }

    const data = await deleteOtp(user.id)

    return NextResponse.json(data,{status:200})
  }
  catch(error) {
    console.log("[OTP_ERROR]", error);
    return new NextResponse("Internal server error.",{status:500})
  }
}