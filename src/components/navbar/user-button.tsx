
import React from 'react'
import { UserButton as LoginUserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import CustomLoader from "@/components/ui/custom-loader";
function UserButton() {
  return (
    <div className="w-8 h-8 flex justify-center items-center ">
      <ClerkLoaded>
        <LoginUserButton afterSignOutUrl="/"
    appearance={{
      elements:{
        avatarImage:"h-6 w-6 border-2 rounded-full"
      }
    }} />
      </ClerkLoaded>
      <ClerkLoading >
        <CustomLoader className="h-5 w-5" />  
      </ClerkLoading>
    </div>
  )
}

export default UserButton