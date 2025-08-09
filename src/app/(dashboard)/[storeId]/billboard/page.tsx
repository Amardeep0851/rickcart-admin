import React from 'react'
import ClientComponent from "./components/client-component"

function BillboardPage({params}:{params:Promise<{storeId:string}>}) {

  return (
    <div className="px-4">
      <ClientComponent />

    </div>
  )
}

export default BillboardPage