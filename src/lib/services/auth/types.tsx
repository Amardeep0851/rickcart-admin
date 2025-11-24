import z from "zod";
import {User as UserPrisma, Otp} from "@prisma/client"

export type UserForCreateAccount = {
  email:string;
  hashedPassword:string;
  firstName:string;
  lastName:string;
}

export type User = UserPrisma
export type UserOTP = UserPrisma & {
otps:Otp
}