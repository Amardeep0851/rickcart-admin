import { Prisma } from "@prisma/client";
import { format, startOfDay, startOfMonth, subDays, subMonths } from "date-fns";

import { db } from "@/lib/db";
import {
  DashboardAnalyticsProps,
  OrderAddress,
  OrderDetailProps,
  OrderListDataProps,
} from "./order-types";

const ORDER_STATUS_VALUES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const PAYMENT_STATUS_VALUES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const;

const decimalToNumber = (value: Prisma.Decimal | null | undefined) => {
  return value?.toNumber() ?? 0;
};

const formatEnumLabel = (value: string) => {
  return value
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

const parseAddress = (
  value: Prisma.JsonValue | null | undefined
): OrderAddress | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as OrderAddress;
};

const formatCustomerName = (user: { firstName: string; lastName: string }) => {
  return `${user.firstName} ${user.lastName}`.trim();
};

const getOrderItemName = (item: {
  productId?: string | null;
  product?: {
    name: string;
  } | null;
}) => {
  if (item.product?.name) {
    return item.product.name;
  }

  if (item.productId) {
    return `Product ${item.productId.slice(0, 8)}`;
  }

  return "Unavailable Product";
};

const buildOrderListItem = (order: {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: Prisma.Decimal;
  createdAt: Date;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: {
    quantity: number;
  }[];
}): OrderListDataProps => {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: formatCustomerName(order.user),
    customerEmail: order.user.email,
    itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
    status: formatEnumLabel(order.status),
    paymentStatus: formatEnumLabel(order.paymentStatus),
    totalAmount: decimalToNumber(order.totalAmount),
    createdAt: format(order.createdAt, "d LLL yyyy, hh:mm a"),
  };
};

const ensureStoreAccess = async (storeId: string, userId: string) => {
  return db.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
    select: {
      id: true,
      name: true,
    },
  });
};

export const fetchOrders = async (storeId: string, userId: string) => {
  const store = await ensureStoreAccess(storeId, userId);

  if (!store) {
    return null;
  }

  const orders = await db.order.findMany({
    where: {
      storeId,
      store: {
        userId,
      },
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      items: {
        select: {
          quantity: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map(buildOrderListItem);
};

export const fetchOrderWithId = async (
  storeId: string,
  orderId: string,
  userId: string
) => {
  const store = await ensureStoreAccess(storeId, userId);

  if (!store) {
    return null;
  }

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      storeId,
      store: {
        userId,
      },
    },
    include: {
      store: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      items: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          productId: true,
          quantity: true,
          price: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  const listItem = buildOrderListItem(order);

  const details: OrderDetailProps = {
    ...listItem,
    storeName: order.store.name,
    subtotal: decimalToNumber(order.subtotal),
    taxAmount: decimalToNumber(order.taxAmount),
    shippingCost: decimalToNumber(order.shippingCost),
    updatedAt: format(order.updatedAt, "d LLL yyyy, hh:mm a"),
    shippedAt: order.shippedAt
      ? format(order.shippedAt, "d LLL yyyy, hh:mm a")
      : null,
    deliveredAt: order.deliveredAt
      ? format(order.deliveredAt, "d LLL yyyy, hh:mm a")
      : null,
    trackingNumber: order.trackingNumber,
    shippingAddress: parseAddress(order.shippingAddress) ?? {},
    billingAddress: parseAddress(order.billingAddress),
    items: order.items.map((item) => {
      const price = decimalToNumber(item.price);

      return {
        id: item.id,
        productId: item.productId,
        productName: getOrderItemName(item),
        productImage: null,
        quantity: item.quantity,
        price,
        totalPrice: price * item.quantity,
      };
    }),
  };

  return details;
};

export const fetchDashboardAnalytics = async (
  storeId: string,
  userId: string
) => {
  const store = await ensureStoreAccess(storeId, userId);

  if (!store) {
    return null;
  }

  const [orders, activeProducts] = await db.$transaction([
    db.order.findMany({
      where: {
        storeId,
        store: {
          userId,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          select: {
            quantity: true,
            price: true,
            productId: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.product.count({
      where: {
        storeId,
        store: {
          userId,
        },
        isActive: true,
      },
    }),
  ]);

  const totalRevenue = orders.reduce((total, order) => {
    return total + decimalToNumber(order.totalAmount);
  }, 0);

  const totalOrders = orders.length;
  const itemsSold = orders.reduce((total, order) => {
    return (
      total +
      order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0)
    );
  }, 0);
  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const monthlySeed = Array.from({ length: 6 }, (_, index) => {
    const date = subMonths(startOfMonth(new Date()), 5 - index);

    return {
      key: format(date, "yyyy-MM"),
      month: format(date, "MMM yy"),
      revenue: 0,
      orders: 0,
    };
  });

  const monthlyMap = new Map(
    monthlySeed.map((item) => [item.key, { ...item }])
  );

  const dailySeed = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(startOfDay(new Date()), 6 - index);

    return {
      key: format(date, "yyyy-MM-dd"),
      day: format(date, "EEE"),
      revenue: 0,
      orders: 0,
    };
  });

  const dailyMap = new Map(dailySeed.map((item) => [item.key, { ...item }]));
  const orderStatusMap = new Map(
    ORDER_STATUS_VALUES.map((item) => [item, 0])
  );
  const paymentStatusMap = new Map(
    PAYMENT_STATUS_VALUES.map((item) => [item, 0])
  );
  const topProductsMap = new Map<
    string,
    { name: string; quantity: number; revenue: number }
  >();

  orders.forEach((order) => {
    const revenue = decimalToNumber(order.totalAmount);
    const monthKey = format(startOfMonth(order.createdAt), "yyyy-MM");
    const dayKey = format(startOfDay(order.createdAt), "yyyy-MM-dd");

    const monthData = monthlyMap.get(monthKey);
    if (monthData) {
      monthData.revenue += revenue;
      monthData.orders += 1;
    }

    const dayData = dailyMap.get(dayKey);
    if (dayData) {
      dayData.revenue += revenue;
      dayData.orders += 1;
    }

    orderStatusMap.set(
      order.status,
      (orderStatusMap.get(order.status) ?? 0) + 1
    );
    paymentStatusMap.set(
      order.paymentStatus,
      (paymentStatusMap.get(order.paymentStatus) ?? 0) + 1
    );

    order.items.forEach((item) => {
      const itemRevenue = decimalToNumber(item.price) * item.quantity;
      const productName = getOrderItemName(item);
      const existingItem = topProductsMap.get(productName);

      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.revenue += itemRevenue;
        return;
      }

      topProductsMap.set(productName, {
        name: productName,
        quantity: item.quantity,
        revenue: itemRevenue,
      });
    });
  });

  const analytics: DashboardAnalyticsProps = {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    itemsSold,
    activeProducts,
    revenueTrend: monthlySeed.map(({ key, ...rest }) => {
      const data = monthlyMap.get(key);

      return data ? { month: data.month, revenue: data.revenue, orders: data.orders } : rest;
    }),
    dailyOrderTrend: dailySeed.map(({ key, ...rest }) => {
      const data = dailyMap.get(key);

      return data ? { day: data.day, revenue: data.revenue, orders: data.orders } : rest;
    }),
    orderStatusData: ORDER_STATUS_VALUES.map((item) => ({
      name: formatEnumLabel(item),
      value: orderStatusMap.get(item) ?? 0,
    })),
    paymentStatusData: PAYMENT_STATUS_VALUES.map((item) => ({
      name: formatEnumLabel(item),
      value: paymentStatusMap.get(item) ?? 0,
    })),
    topProducts: Array.from(topProductsMap.values())
      .sort((left, right) => right.quantity - left.quantity)
      .slice(0, 5),
    recentOrders: orders.slice(0, 5).map(buildOrderListItem),
  };

  return analytics;
};
