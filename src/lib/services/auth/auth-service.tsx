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


export const updateUserForFailedAttempt = async (userId:string ):Promise<UserOTP | null> => {
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
    },
    include:{
      otps:true
    }
  })
}

export const deleteOtpAndUpdateUser = async (userId:string, hashedToken:string, expiresAt:Date) => {
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
      },
      sessions:{
        create:{
          hashedSessionToken:hashedToken,
          expiresAt:expiresAt
        }
      }
    }
  })
}


export const findUser = async (hashedToken:string) => {
  return await db.session.findUnique({
        where: { hashedSessionToken:  hashedToken },
        include: { 
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              emailVerified :true
              // DO NOT select hashedPassword
            }
          } 
        }
      });
}

export const deleteSession = async (sessionId:string) => {
 return  await db.session.delete({ where: { hashedSessionToken: sessionId } });
}