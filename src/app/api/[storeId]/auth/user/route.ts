import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashToken } from "@/lib/utils";
import { deleteSession, findUser } from "@/lib/services/auth/auth-service";
import { db } from "@/lib/db";

export async function GET(req:NextRequest) {
  try {
    // 1. Get Token
    const cookieStore = await cookies(); 

    const token = cookieStore.get("SessionToken")?.value;
    console.log(token);

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
   const hashedToken = hashToken(token);
   console.log("This is hashed token",hashedToken );

    // 2. Find Session & User in DB
    // We also check if the session is expired
    const session = await findUser(hashedToken)

    // 3. Validation Checks
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    if (new Date() > session.expiresAt) {
      // Cleanup expired session
      deleteSession(hashedToken)
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // 4. Success
    if(session.user.emailVerified === false){
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: session.user }, { status: 200 });

  } catch (error) {
    console.error("Auth Check Error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}