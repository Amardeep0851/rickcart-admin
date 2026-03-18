"use client";

import Link from "next/link";
import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Store,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageHeading from "@/components/ui/page-heading";
import { DashboardAnalyticsProps } from "@/lib/services/orders/order-types";
import { formatCurrency } from "@/lib/utils";

interface DashboardClientProps {
  analytics: DashboardAnalyticsProps;
  storeId: string;
}

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const getBadgeClassName = (value: string) => {
  const normalizedValue = value.toLowerCase();

  if (
    normalizedValue.includes("delivered") ||
    normalizedValue.includes("paid") ||
    normalizedValue.includes("confirmed")
  ) {
    return "bg-emerald-600";
  }

  if (
    normalizedValue.includes("cancelled") ||
    normalizedValue.includes("failed") ||
    normalizedValue.includes("refunded")
  ) {
    return "bg-rose-600";
  }

  if (
    normalizedValue.includes("pending") ||
    normalizedValue.includes("processing")
  ) {
    return "bg-amber-600";
  }

  return "bg-sky-600";
};

const ChartEmptyState = ({ label }: { label: string }) => {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
      {label}
    </div>
  );
};

function DashboardClient({ analytics, storeId }: DashboardClientProps) {
  const topQuantity = analytics.topProducts[0]?.quantity || 1;

  const metricCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(analytics.totalRevenue),
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: analytics.totalOrders.toString(),
      icon: ShoppingCart,
    },
    {
      label: "Average Order",
      value: formatCurrency(analytics.averageOrderValue),
      icon: TrendingUp,
    },
    {
      label: "Items Sold",
      value: analytics.itemsSold.toString(),
      icon: Package,
    },
    {
      label: "Active Products",
      value: analytics.activeProducts.toString(),
      icon: Store,
    },
  ];

  return (
    <div className="px-4 py-4 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <PageHeading
          title="Dashboard"
          description="Track income, order movement, and product performance for your store in one place."
        />
        <Button asChild variant="outline" className="cursor-pointer">
          <Link href={`/${storeId}/orders`}>View Orders</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {card.label}
                </p>
                <Icon className="size-4 text-zinc-500 dark:text-zinc-400" />
              </div>
              <p className="pt-3 text-2xl font-semibold">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <div className="pb-4">
            <h2 className="text-lg font-semibold">Revenue Trend</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Monthly revenue and order volume for the last six months.
            </p>
          </div>
          {analytics.revenueTrend.some((item) => item.orders > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  fill="var(--color-chart-1)"
                  fillOpacity={0.2}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-chart-2)"
                  fill="var(--color-chart-2)"
                  fillOpacity={0.15}
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState label="Revenue charts will appear after the first order." />
          )}
        </div>

        <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <div className="pb-4">
            <h2 className="text-lg font-semibold">Order Status</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              See how open and completed orders are distributed.
            </p>
          </div>
          {analytics.orderStatusData.some((item) => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {analytics.orderStatusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState label="Order status data will appear after checkout activity starts." />
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <div className="pb-4">
            <h2 className="text-lg font-semibold">Recent Order Volume</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Daily orders and revenue for the last seven days.
            </p>
          </div>
          {analytics.dailyOrderTrend.some((item) => item.orders > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analytics.dailyOrderTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="orders"
                  fill="var(--color-chart-2)"
                  radius={[6, 6, 0, 0]}
                  name="Orders"
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-chart-1)"
                  radius={[6, 6, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState label="Daily order charts will appear once orders are coming in." />
          )}
        </div>

        <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <div className="pb-4">
            <h2 className="text-lg font-semibold">Payment Status</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Track how payments are settling across recent orders.
            </p>
          </div>
          {analytics.paymentStatusData.some((item) => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={analytics.paymentStatusData}
                layout="vertical"
                margin={{ left: 10, right: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="var(--color-chart-3)"
                  radius={[0, 6, 6, 0]}
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState label="Payment summaries will appear once orders are recorded." />
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Latest order history for quick follow-up.
              </p>
            </div>
            <Button asChild variant="ghost" className="cursor-pointer">
              <Link href={`/${storeId}/orders`}>Open All</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {analytics.recentOrders.length ? (
              analytics.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/${storeId}/orders/${order.id}`}
                  className="block rounded-sm border border-zinc-200 p-3 transition-all hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {order.customerName} - {order.customerEmail}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className={getBadgeClassName(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getBadgeClassName(order.paymentStatus)}
                      >
                        {order.paymentStatus}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No order history yet.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <div className="pb-4">
            <h2 className="text-lg font-semibold">Top Items</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Best-performing products based on units sold.
            </p>
          </div>
          <div className="space-y-3">
            {analytics.topProducts.length ? (
              analytics.topProducts.map((item, index) => (
                <div
                  key={item.name}
                  className="rounded-sm border border-zinc-200 p-3 dark:border-zinc-700"
                >
                  <div className="flex items-center justify-between gap-x-4">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {item.quantity} items sold
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(
                          (item.quantity / topQuantity) * 100,
                          8
                        )}%`,
                        backgroundColor: chartColors[index % chartColors.length],
                      }}
                    />
                  </div>
                  <p className="pt-2 text-sm font-semibold">
                    {formatCurrency(item.revenue)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Top selling items will appear after orders come in.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardClient;
