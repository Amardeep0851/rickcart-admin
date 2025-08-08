import Image from "next/image";
import React from 'react';

function AuthLayout({children}:{children:React.ReactNode}) {
  return (
    <div className="flex justify-center items-center w-full h-full bg-cover bg-top-left">
      <Image src={"/site-images/pexels-apasaric-325185.jpg"} fill alt="background" className="object-cover origin-top-left -z-20 absolute top-0 " />
      
      {children}
    </div>
  )
}

export default AuthLayout