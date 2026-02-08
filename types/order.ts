import { GstSlab, ProductCategory } from "@/prisma/generated/prisma/enums";

export interface OrderItemDetails {
  id: string;
  productName: string;
  variantName: string;
  quantity: number;
  netContent: number;
  measurementUnit: string;
  unitPrice: number;
  taxAmount: number;
  batchNumber: string;
  mfgDate: Date;
  expiryDate: Date;
  hsnCode: string;
  gstSlab: GstSlab;
  productCategory: ProductCategory;
}

export interface AddressDetails {
  street: string;
  area: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderWithDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  totalTax: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemDetails[];
  shippingAddress: AddressDetails | null;
  billingAddress: AddressDetails | null;
}
