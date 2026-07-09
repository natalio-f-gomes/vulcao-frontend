import {
  BusinessModel,
  BusinessRegistrationModel,
  BusinessStats,
  BusinessStatus,
  WeeklySchedule,
} from "../Interfaces/businesses";
import { AddressModel } from "../Interfaces/global";
import { fetchAPIWithCredentials, fetchAPIWithoutCredentials } from "./global";

export async function getBusinessById(id: string) {
  const endpoint: string = `/v2/public/business/get/${id}`;
  return await fetchAPIWithoutCredentials(endpoint, { method: "GET" });
}

export async function RegisterBusiness(business: BusinessRegistrationModel) {
  const endpoint: string = `/v2/business/register`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(business),
  });
}

export async function updateBusinessAboutInfo(
  id: string,
  info: {
    name: string;
    description: string;
    status: BusinessStatus;
  },
) {
  const endpoint: string = `/v2/business/update/about/${id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(info),
  });
}

export async function updateBusinessContact(
  id: string,
  info: {
    phoneNumber: string;
    email: string;
  },
) {
  const endpoint: string = `/v2/business/update/contact/${id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(info),
  });
}

export async function updateBusinessAddress(id: string, address: AddressModel) {
  const endpoint: string = `/v2/business/update/address/${id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(address),
  });
}

export async function updateBusinessSchedule(
  id: string,
  schedule: WeeklySchedule,
) {
  const endpoint: string = `/v2/business/update/schedule/${id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(schedule),
  });
}

export async function updateBusiness(
  busienssId: string,
  updateData: BusinessModel,
) {
  const endpoint: string = `/v2/business/update/${busienssId}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
}

export async function GetBusinessOrders(businessId: string) {
  const endpoint: string = `/v2/business/${businessId}/get/orders`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}
