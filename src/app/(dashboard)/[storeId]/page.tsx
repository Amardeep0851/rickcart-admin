import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import DashboardClient from "./components/dashboard-client";
import { fetchDashboardAnalytics } from "@/lib/services/orders/order-services";

async function DashboardPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { userId } = await auth();
  const { storeId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const analytics = await fetchDashboardAnalytics(storeId, userId);

  if (!analytics) {
    redirect("/");
  }

  return <DashboardClient analytics={analytics} storeId={storeId} />;
}

export default DashboardPage;
