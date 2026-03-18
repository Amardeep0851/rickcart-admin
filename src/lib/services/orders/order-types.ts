export type OrderAddress = Record<string, unknown>;

export interface OrderListDataProps {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
}

export interface OrderItemDataProps {
  id: string;
  productId: string | null;
  productName: string;
  productImage: string | null;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface OrderDetailProps extends OrderListDataProps {
  storeName: string;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  updatedAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  trackingNumber: string | null;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress | null;
  items: OrderItemDataProps[];
}

export interface DashboardAnalyticsProps {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  itemsSold: number;
  activeProducts: number;
  revenueTrend: {
    month: string;
    revenue: number;
    orders: number;
  }[];
  dailyOrderTrend: {
    day: string;
    revenue: number;
    orders: number;
  }[];
  orderStatusData: {
    name: string;
    value: number;
  }[];
  paymentStatusData: {
    name: string;
    value: number;
  }[];
  topProducts: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
  recentOrders: OrderListDataProps[];
}
