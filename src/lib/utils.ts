import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateExpireDate = (minutes:number=10) => {
  return new Date(Date.now() + minutes*60*1000)
}
