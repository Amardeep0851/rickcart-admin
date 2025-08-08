import CustomLoader from "@/components/ui/custom-loader"
import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'

export default function Page() {
  return <div>
  <ClerkLoaded>
    <SignIn />
  </ClerkLoaded>
  <ClerkLoading>
    <CustomLoader />
  </ClerkLoading>
  </div>
}