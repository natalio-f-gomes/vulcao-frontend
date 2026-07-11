import { ProductModel, WearableModel } from "../Interfaces/offerings";
import { fetchAPIWithCredentials } from "./global";

const OFFERING_PUBLIC_API = "/v2/public/offering";

export async function findAllOfferings() {
  const endpoint = `${OFFERING_PUBLIC_API}/get/all`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

// PRODUCT API

export async function getAllProducts() {
  const endpoint = `${OFFERING_PUBLIC_API}/product/get/all`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getProductById(id: string) {
  const endpoint = `${OFFERING_PUBLIC_API}/product/get/${id}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function findProductsByCreatorId(id: string) {
  const endpoint = `${OFFERING_PUBLIC_API}/product/get/creator/${id}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function findProductsByCompanyId(id: string) {
  const endpoint = `${OFFERING_PUBLIC_API}/business/${id}/get/product`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

const OFFERING_PRIVATE_API = "/v2/offering";

export async function addProduct(product: ProductModel) {
  const endpoint = `${OFFERING_PRIVATE_API}/add/product`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id: string, product: ProductModel) {
  const endpoint = `${OFFERING_PRIVATE_API}/update/product/${id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: string) {
  const endpoint = `${OFFERING_PRIVATE_API}/delete/product/${id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "DELETE",
  });
}

//==============================

export async function getAllWearables() {
  const endpoint = `${OFFERING_PUBLIC_API}/wearable/get/all`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function findWearablesByCompanyId(id: string) {
  const endpoint = `${OFFERING_PUBLIC_API}/business/${id}/get/wearable`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function addWearable(wearable: WearableModel) {
  const endpoint = `${OFFERING_PRIVATE_API}/add/wearable`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(wearable),
  });
}

export async function updateWearable(id: string, wearable: WearableModel) {
  const endpoint = `${OFFERING_PRIVATE_API}/update/wearable/${id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(wearable),
  });
}

export async function deleteWearable(id: string) {
  const endpoint = `${OFFERING_PRIVATE_API}/delete/wearable/${id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "DELETE",
  });
}
