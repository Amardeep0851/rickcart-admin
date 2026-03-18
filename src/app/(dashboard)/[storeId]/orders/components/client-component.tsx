"use client";

import React from "react";

import { columns } from "./coulmn";
import DataTable from "@/components/ui/data-table";
import PageHeading from "@/components/ui/page-heading";
import { Separator } from "@/components/ui/separator";
import { OrderListDataProps } from "@/lib/services/orders/order-types";

interface OrderClientProps {
  Data: OrderListDataProps[];
}

function ClientComponent({ Data }: OrderClientProps) {
  return (
    <div>
      <div className="flex justify-between pt-4 pb-4">
        <PageHeading
          title="Orders"
          description="Review all customer orders placed in your store. Search by order number and open any order to inspect the customer, pricing, and purchased items."
        />
      </div>
      <Separator />
      <div className="pt-4">
        <DataTable
          data={Data}
          columns={columns}
          searchKey="orderNumber"
          searchPlaceholder="Search by order number"
        />
      </div>
    </div>
  );
}

export default ClientComponent;
