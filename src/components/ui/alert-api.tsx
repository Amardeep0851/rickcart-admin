import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "./alert"

function AlertApi() {
  return (
    <Alert variant="default">
  
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
</Alert>
  )
}

export default AlertApi