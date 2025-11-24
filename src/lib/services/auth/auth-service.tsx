import { db } from "@/lib/db";
import { User, UserForCreateAccount, UserOTP } from "./types";
import { OtpType } from "@prisma/client";

export const fetchAccountWithEmail = async (email: string):Promise<UserOTP | null> => {
  const response = db.user.findFirst({
    where: {
      email
    },
    include:{
      otps:true
    },
    orderBy:{
      createdAt:"desc"
    }
    
  });
  return response;
};

export const createUser = async (
  data: UserForCreateAccount,
  otp: string,
  expiresAt: Date
):Promise<User | null> => {
  return await db.user.create({
  data: {
    ...data,
    otps: {
      create: {
        otp,                
        type: OtpType.Email,
        expiresAt,
      },
    },
  },
});
};

export const updateNotVerifiedUser = async (data: UserForCreateAccount,
  otp: string,
  expiresAt: Date):Promise<User | null> => {
  return await db.user.update({
  where: {
    email: data.email
  },
  data: {
    firstName: data.firstName,
    lastName: data.lastName,
    hashedPassword: data.hashedPassword,
    
    // Correct 'upsert' syntax
    otps: {
      upsert: {
        // 1. Logic if it exists (Update it)
        update: {
          otp: otp,
          type: OtpType.Email,
          expiresAt: expiresAt,
          failedAttempts: 0, // Senior Tip: Always reset this on update!
        },
        // 2. Logic if it doesn't exist (Create it)
        create: {
          otp: otp,
          type: OtpType.Email,
          expiresAt: expiresAt,
          failedAttempts: 0
        }
      }
    },
  }
})

}


export const updateOtpForFailedAttempt = async (userId:string ) => {
  return await db.user.update({
    where:{
      id:userId
    },
    data:{
      otps:{
        update:{
          failedAttempts:{
        increment:1
          }
        }
      }
    }
  })
}

export const deleteOtp = async (userId:string) => {
  return await db.user.update({
    where:{
      id:userId
    },
    data:{
      emailVerified:true,
      otps:{
        delete:{
          type:OtpType.Email
        }
      }
    }
  })
}