import { hashToken } from "@/lib/server-utils/utils";
import { deleteSession, findUser } from "@/lib/services/auth/auth-service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("SessionToken")?.value;

    if (!token) {
      return new NextResponse("Unathroized access.", { status: 401 });
    }

    const hashedToken = hashToken(token);
    const isSessionExist = await findUser(hashedToken);

    if (!isSessionExist) {
      cookieStore.delete({ name: "SessionToken", path: "/" });
      return new NextResponse("Unathroized access.", { status: 401 });
    }

    const response = await deleteSession(hashedToken);
    if (!response) {
      return new NextResponse("Something went wrong. Please try again.", {
        status: 500,
      });
    }
    cookieStore.delete({ name: "SessionToken", path: "/" });
    return NextResponse.json({ user: null }, { status: 200 });
  } catch (error) {
    console.log("[ERROR_WHILE_LOGOUT]", error);
    return new NextResponse("Something went wrong. Please try again.", {
      status: 500,
    });
  }
}
