import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_KEY);

export const sendMail = async (firstname: string, otp: string, to: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: to,
      subject: "Otp",
      react: <EmailTemplate firstName={firstname} otp={otp} />,
    });
    return {success:true}
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error };
  }
};
