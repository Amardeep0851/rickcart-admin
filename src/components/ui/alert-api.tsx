"use client"
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, CopyCheck, Server } from "lucide-react";
import useOrigin from "@/hooks/use-origin";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMapForBadge: Record<ApiAlertProps["variant"], string> = {
  public: "public",
  admin: "admin",
};

const badgeVariant: Record<
  ApiAlertProps["variant"],
  "secondary" | "destructive"
> = {
  public: "secondary",
  admin: "destructive",
};

function AlertApi({title, description, variant}:ApiAlertProps) {

    const origin = useOrigin();
    const [isCopied , setIsCopied ] = useState(false);
    const text = `${origin}/${description}`

    const onCopy = () => {
      setIsCopied(true);
      navigator.clipboard.writeText(text);
      setTimeout(() => {
        setIsCopied(false)
      }, 2000);
    }
  
  return (
    <Alert variant="default" >
      <Server className="w-4 h-4" />
      <AlertTitle className="flex gap-3">
        {title}
        <Badge variant={badgeVariant[variant]}>
          {textMapForBadge[variant]}
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex justify-between  py-2">
        <code className="bg-zinc-100 dark:bg-zinc-800 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
          {text}
        </code>
        {
        isCopied 
        ? <Check className="w-4 h-4 cursor-pointer"  /> 
        : <Copy className="w-4 h-4 cursor-pointer" onClick={onCopy}/>
        }
      </AlertDescription>
    </Alert>
  );
}

export default AlertApi;
