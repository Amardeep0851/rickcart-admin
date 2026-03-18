import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import ClientComponent from "./components/client-component";
import { fetchOrders } from "@/lib/services/orders/order-services";

async function OrdersPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { userId } = await auth();
  const { storeId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const data = await fetchOrders(storeId, userId);

  if (!data) {
    redirect("/");
  }

  return (
    <div className="px-4">
      <ClientComponent Data={data} />
    </div>
  );
}

export default OrdersPage;
