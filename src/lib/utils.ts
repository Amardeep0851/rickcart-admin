import { randomInt } from "crypto";
import * as argon2 from "@node-rs/argon2"
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const hashPassword = async (password:string) => {
  return await argon2.hash(password)
}

export const verifyPassword = async (hashedPassword:string, password:string) => {
  return await argon2.verify(hashedPassword, password)
}


export function generateOtp(length: number = 6): string {
  // crypto.randomInt returns a number between min (inclusive) and max (exclusive).
  // For 6 digits: 100,000 to 1,000,000 (which is 999,999)
  
  const min = Math.pow(10, length - 1); // 100000
  const max = Math.pow(10, length);     // 1000000
  
  // This is Cryptographically Secure
  const otp = randomInt(min, max);
  
  return otp.toString();
}


export const generateExpireDate = (minutes:number=10) => {
  return new Date(Date.now() + minutes*60*1000)
}

export function createTokenPair(bytes = 48) {
  const token = crypto.randomBytes(bytes).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
}

// Hash session token directly (raw -> sha256 hex)
export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}