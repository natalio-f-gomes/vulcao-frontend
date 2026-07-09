import { OrderRequest, OrderStatus } from "../Interfaces/global";
import { fetchAPIWithCredentials } from "./global";

export async function GetClientCart() {
  return await fetchAPIWithCredentials(`/v2/client/get/cart`, {
    method: "GET",
  });
}

export async function AddToCart(offeringId: string, quantity: number) {
  return await fetchAPIWithCredentials(
    `/v2/client/cart/add/${offeringId}/${quantity}`,
    { method: "POST" },
  );
}

export async function UpdateCartItem(offeringId: string, quantity: number) {
  return await fetchAPIWithCredentials(
    `/v2/client/cart/update/${offeringId}/${quantity}`,
    { method: "PUT" },
  );
}

export async function DeleteCartItem(offeringId: string) {
  return await fetchAPIWithCredentials(`/v2/client/cart/delete/${offeringId}`, {
    method: "DELETE",
  });
}

export async function PlaceOrder(
  businessId: string,
  orderRequest: OrderRequest,
) {
  const endpoint: string = `/v2/client/place/order/${businessId}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(orderRequest),
  });
}

export async function GetClientOrders() {
  const endpoint: string = `/v2/client/get/orders`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "GET",
  });
}

export async function CancelOrder(trackId: string) {
  const endpoint: string = `/v2/client/cancel/order/${trackId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "PUT" });
}

export async function BusinessUpdateOrderStatus(
  id: string,
  status: OrderStatus,
) {
  const endpoint: string = `/v2/business/update/order/${id}/status`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(status),
  });
}
