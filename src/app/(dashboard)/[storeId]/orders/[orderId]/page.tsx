import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeftRight, Package2, ReceiptText, Truck } from "lucide-react";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageHeading from "@/components/ui/page-heading";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchOrderWithId } from "@/lib/services/orders/order-services";
import { OrderAddress } from "@/lib/services/orders/order-types";
import { formatCurrency } from "@/lib/utils";

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

const formatAddressLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) => value.toUpperCase());
};

const formatAddressValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const renderAddress = (address: OrderAddress | null) => {
  if (!address || !Object.keys(address).length) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Not provided.</p>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(address).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between gap-x-4 text-sm"
        >
          <span className="text-zinc-500 dark:text-zinc-400">
            {formatAddressLabel(key)}
          </span>
          <span className="text-right font-medium">{formatAddressValue(value)}</span>
        </div>
      ))}
    </div>
  );
};

async function OrderDetailPage({
  params,
}: {
  params: Promise<{ storeId: string; orderId: string }>;
}) {
  const { userId } = await auth();
  const { storeId, orderId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const order = await fetchOrderWithId(storeId, orderId, userId);

  if (!order) {
    redirect(`/${storeId}/orders`);
  }

  const summaryCards = [
    {
      label: "Subtotal",
      value: formatCurrency(order.subtotal),
      icon: ReceiptText,
    },
    {
      label: "Shipping",
      value: formatCurrency(order.shippingCost),
      icon: Truck,
    },
    {
      label: "Tax",
      value: formatCurrency(order.taxAmount),
      icon: ArrowLeftRight,
    },
    {
      label: "Total",
      value: formatCurrency(order.totalAmount),
      icon: Package2,
    },
  ];

  return (
    <div className="px-4 py-4 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <PageHeading
          title={order.orderNumber}
          description={`Review the full order history, purchased items, and fulfillment progress for ${order.customerName}.`}
        />
        <Button asChild variant="outline" className="cursor-pointer">
          <Link href={`/${storeId}/orders`}>Back To Orders</Link>
        </Button>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
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

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-x-4">
                <span className="text-zinc-500 dark:text-zinc-400">Store</span>
                <span className="font-medium">{order.storeName}</span>
              </div>
              <div className="flex items-center justify-between gap-x-4">
                <span className="text-zinc-500 dark:text-zinc-400">Customer</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex items-center justify-between gap-x-4">
                <span className="text-zinc-500 dark:text-zinc-400">Email</span>
                <span className="font-medium">{order.customerEmail}</span>
              </div>
              <div className="flex items-center justify-between gap-x-4">
                <span className="text-zinc-500 dark:text-zinc-400">Placed</span>
                <span className="font-medium">{order.createdAt}</span>
              </div>
              <div className="flex items-center justify-between gap-x-4">
                <span className="text-zinc-500 dark:text-zinc-400">Updated</span>
                <span className="font-medium">{order.updatedAt}</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-x-4">
                <span className="text-zinc-500 dark:text-zinc-400">Status</span>
                <Badge variant="secondary" className={getBadgeClassName(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-x-4">
                <span className="text-zinc-500 dark:text-zinc-400">Payment</span>
                <Badge
                  variant="secondary"
                  className={getBadgeClassName(order.paymentStatus)}
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-x-4">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Tracking Number
                </span>
                <span className="font-medium">
                  {order.trackingNumber ?? "Not assigned"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-x-4">
                <span className="text-zinc-500 dark:text-zinc-400">Shipped At</span>
                <span className="font-medium">{order.shippedAt ?? "Pending"}</span>
              </div>
              <div className="flex items-center justify-between gap-x-4">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Delivered At
                </span>
                <span className="font-medium">
                  {order.deliveredAt ?? "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Purchased Items</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="rounded-sm border border-zinc-200 p-3 dark:border-zinc-700"
              >
                <div className="flex items-center justify-between gap-x-4">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          <div className="mt-4">{renderAddress(order.shippingAddress)}</div>
        </div>

        <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Billing Address</h2>
          <div className="mt-4">{renderAddress(order.billingAddress)}</div>
        </div>
      </div>

      <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Item Breakdown</h2>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(item.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.totalPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
