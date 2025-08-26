import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page

// "use client";
// import { useState } from "react";

// export default function Page() {
//   const [progress, setProgress] = useState(0);
//   const [data, setData ] = useState([]);

//   async function fetchWithProgress() {
//     const response = await fetch("http://localhost:3000/c75b256f-068e-4275-af5d-e898f1f8d0e6/options");
//     // setData(response)
//     console.log(response,"------");
//     const reader = response.body?.getReader();
//     const contentLength = +response.headers.get("Content-Length")!;

//     let received = 0;
//     let chunks = [];

//     while (true) {
//       const { done, value } = await reader!.read();
//       if (done) break;
//       chunks.push(value);
//       received += value.length;
//       setProgress(Math.floor((received / contentLength) * 100));
//     }

//     return new TextDecoder("utf-8").decode(new Uint8Array(chunks.flat()));
//   }

//   return (
//     <div>
//       <button onClick={fetchWithProgress}>Load Data</button>
//       <p>Progress: {progress}%</p>
//     </div>
//   );
// }