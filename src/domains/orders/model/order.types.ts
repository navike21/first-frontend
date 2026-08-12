export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const PAYMENT_STATUSES = [
  'unpaid',
  'partially_paid',
  'paid',
  'refunded',
] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

// Mirrors the backend's state machine (orders/constants/orderStatus.ts) so
// the UI never offers a transition the server would reject.
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

export const PAYMENT_STATUS_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  unpaid: ['partially_paid', 'paid'],
  partially_paid: ['paid', 'refunded'],
  paid: ['refunded'],
  refunded: [],
}

export interface Money {
  amount: number
  currency: string
}

export interface OrderAddress {
  country?: string
  ubigeoCode?: string
  region?: string
  province?: string
  district?: string
  address?: string
  addressNumber?: string
  addressInterior?: string
}

export interface OrderItem {
  productId: string
  variantId?: string | null
  nameSnapshot: string
  skuSnapshot?: string
  unitPrice: Money
  quantity: number
  lineTotal: Money
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  items: OrderItem[]
  subtotal: Money
  discountTotal: Money
  couponCode?: string | null
  shippingCost: Money
  shippingRuleId?: string | null
  taxTotal: Money
  total: Money
  currency: string
  shippingAddress: OrderAddress
  billingAddress: OrderAddress
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethodId?: string | null
  fulfillmentLocationId: string
  trackingNumber?: string
  notes?: string
  createdBy: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface OrderListParams {
  page?: number
  limit?: number
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  customerId?: string
  search?: string
}

export interface OrderPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
