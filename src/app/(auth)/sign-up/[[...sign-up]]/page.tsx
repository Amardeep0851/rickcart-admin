import CustomLoader from "@/components/ui/custom-loader"
import { ClerkLoaded, ClerkLoading, SignUp } from '@clerk/nextjs'

export default function Page() {
  return <div>
  <ClerkLoaded>
    <SignUp />
  </ClerkLoaded>
  <ClerkLoading>
    <CustomLoader />
  </ClerkLoading>
  </div>
}