import { ProductModel } from "../../api/interfaces";

export type PublicView = "overview" | "products" | "cart" | "orders";


export interface CartItem {
  id?: string;
  cartId?: string;
  quantity: number;
  companyId?: string;
  itemType?: string;
}

export interface OrderSummary {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  itemCount: number;
}

export interface CartLine {
  product: ProductModel;
  quantity: number;
}
 