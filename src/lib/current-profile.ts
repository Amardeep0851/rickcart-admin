import { auth } from "@clerk/nextjs/server";

const {userId} = await auth();
