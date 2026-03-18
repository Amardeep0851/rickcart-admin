"use client";

import { ColumnDef } from "@tanstack/react-table";

import OrderCellAction from "./order-cell-action";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { OrderListDataProps } from "@/lib/services/orders/order-types";

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

export const columns: ColumnDef<OrderListDataProps>[] = [
  {
    accessorKey: "orderNumber",
    header: () => <div className="w-28">Order</div>,
    cell: ({ row }) => (
      <div className="w-28 font-medium">{row.original.orderNumber}</div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "customerName",
    header: () => <div className="w-48">Customer</div>,
    cell: ({ row }) => (
      <div className="w-48">
        <p className="font-medium">{row.original.customerName}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {row.original.customerEmail}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "itemCount",
    header: () => <div className="w-16 text-center">Items</div>,
    cell: ({ row }) => (
      <div className="w-16 text-center">{row.original.itemCount}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="w-24 text-center">Status</div>,
    cell: ({ row }) => (
      <div className="w-24 text-center">
        <Badge variant="secondary" className={getBadgeClassName(row.original.status)}>
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: () => <div className="w-36 text-center">Payment</div>,
    cell: ({ row }) => (
      <div className="w-36 text-center">
        <Badge
          variant="secondary"
          className={getBadgeClassName(row.original.paymentStatus)}
        >
          {row.original.paymentStatus}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="w-24 text-center">Total</div>,
    cell: ({ row }) => (
      <div className="w-24 text-center">
        {formatCurrency(row.original.totalAmount)}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="w-32">Placed</div>,
    cell: ({ row }) => <div className="w-32 text-sm">{row.original.createdAt}</div>,
  },
  {
    id: "actions",
    header: () => <div className="w-14">Action</div>,
    cell: ({ row }) => <OrderCellAction rowData={row.original} />,
  },
];
