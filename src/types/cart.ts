export interface CartItemData {
  name: string;
  sku: string;
  slug: string;
  qty: number;
  regularPrice: number;
  salePrice: number;
  actualSalePrice: number;
  wogActualSalePrice: number;
  regularShippingAmount: number;
  actualShippingAmount: number;
  couponDiscount: number;
  igst: number;
  sgst: number;
  cgst: number;
  totalGst: number;
  totalAmount: number;
  appUserId?: number;
  image: string;
  minQty: number;
  totalShippingAmount: number;
}

export interface CartItem {
  id: number;
  name: string;
  sku: string;
  qty: number;
  regularPrice: number;
  salePrice: number;
  actualSalePrice: number;
  wogActualSalePrice: number;
  regularShippingAmount: number;
  actualShippingAmount: number;
  couponDiscount: number;
  igst: number;
  sgst: number;
  cgst: number;
  totalGst: number;
  totalAmount: number;
  appUserId: number;
  image: string;
  slug: string;
  minQty: number;
  totalShippingAmount: number;
}
