import { OfferingType } from "./categories";
import { ImageMetadata } from "./ImageValidatorService";
import {
  UserLoginModel,
  UserRegistrationModel,
  AddressModel,
  RegisterStaffModel,
  CompanyModel,
  CompanyRegistrationModel,
  ProductModel,
  CompanyContact,
  CompanyAboutInfo,
  OfferingImageUploadRequest,
  CompanyImageUploadRequest,
  PlaceOrderModel,
  WearableModel,
  ResetPasswordRequest,
  entityType,
  WeekDays,
  WeeklySchedule,
  InquiryModel,
} from "./interfaces";

const URL = "http://localhost:8080";
//const URL = "";

export async function fetchAPIWithCredentials(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  return await fetch(`${URL}/api${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export async function fetchAPIWithoutCredentials(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  return await fetch(`${URL}/api${endpoint}`, {
    ...options,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export async function loginUserRequest(username: string) {
  const endpoint: string = `/v1/auth/user/login/request/${username}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
  });
}

export async function loginUserConfirm(
  mfaCode: string,
  userData: UserLoginModel,
) {
  const endpoint: string = `/v1/auth/user/login/confirm/${mfaCode}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function userRegisterRequest(email: string, username: string) {
  const endpoint: string = `/v1/auth/user/register/request/${email}/${username}`;
  return await fetchAPIWithoutCredentials(endpoint, { method: "POST" });
}

export async function registerUser(
  mfaCode: string,
  userData: UserRegistrationModel,
) {
  const endpoint: string = `/v1/auth/user/register/confirm/${mfaCode}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function logoutEntity(entity: string) {
  const endpoint: string = `/v1/auth/${entity}/logout`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
  });
}

export async function getUserProfileData() {
  const response = await fetchAPIWithCredentials("/v1/user/get/my-profile");

  if (!response.ok) {
    console.log(`Server returned status code ${response.status}`);
  }

  // Handle empty or whitespace-only response bodies safely
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function getUserById(userId: string) {
  const endpoint: string = `/v1/public/user/get/${userId}`;
  return fetchAPIWithoutCredentials(endpoint, { method: "GET" });
}

export async function updateUserProfile(
  user_id: string,
  userProfile: { firstName: string; lastName: string },
) {
  const response = await fetchAPIWithCredentials(
    `/v1/user/update/${user_id}/profile`,
    { method: "PUT", body: JSON.stringify(userProfile) },
  );
  return response;
}

export async function updateUserContact(
  user_id: string,
  userContact: { email: string; phoneNumber: string },
) {
  const response = await fetchAPIWithCredentials(
    `/v1/user/update/${user_id}/contact`,
    { method: "PUT", body: JSON.stringify(userContact) },
  );
  return response;
}

export async function updateUserAddress(
  user_id: string,
  userAddress: AddressModel,
) {
  const response = await fetchAPIWithCredentials(
    `/v1/user/update/${user_id}/address`,
    { method: "PUT", body: JSON.stringify(userAddress) },
  );
  return response;
}

{
  /** This section is for employer apis */
}
export async function registeremployer(employer: UserRegistrationModel) {
  return await fetchAPIWithoutCredentials(`/v1/auth/employer/register`, {
    method: "POST",
    body: JSON.stringify(employer),
  });
}

export async function confirmRegisterEmployer(
  code: string,
  employer: UserRegistrationModel,
) {
  return await fetchAPIWithCredentials(
    `/v1/auth/employer/confirm/register/${code}`,
    { method: "POST", body: JSON.stringify(employer) },
  );
}

export async function registerEmployerRequest(email: string, username: string) {
  return await fetchAPIWithoutCredentials(
    `/v1/auth/employer/request/register/${email}/${username}`,
    { method: "POST" },
  );
}

export async function requestEmployerLogin(username: string) {
  const endpoint: string = `/v1/auth/employer/request/login/${username}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
  });
}

export async function confirmEmployerLogin(
  code: string,
  userData: UserLoginModel,
) {
  const endpoint: string = `/v1/auth/employer/confirm/login/${code}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginStaff(userData: UserLoginModel) {
  const endpoint: string = `/v1/auth/staff/login`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function requestStaffLogin(username: string) {
  const endpoint: string = `/v1/auth/staff/request/login/${username}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
  });
}

export async function confirmStaffLogin(
  code: string,
  userData: UserLoginModel,
) {
  const endpoint: string = `/v1/auth/staff/confirm/login/${code}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function registerCompany(
  newBusiness: CompanyRegistrationModel,
): Promise<Response> {
  const endpoint: string = `/v1/company/register`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(newBusiness),
  });
}

export async function updateCompanyAddress(
  newAddress: AddressModel,
  companyId: string,
): Promise<Response> {
  const endpoint: string = `/v1/company/update/address/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(newAddress),
  });
}

export async function updateCompanyContact(
  newContact: CompanyContact,
  companyId: string,
): Promise<Response> {
  const endpoint: string = `/v1/company/update/contact/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(newContact),
  });
}

export async function getEmployerCompanies() {
  const endpoint: string = `/v1/employer/company/get/all`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function updateCompany(id: string, updatedCompany: CompanyModel) {
  const endpoint: string = `/v1/company/update/${id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(updatedCompany),
  });
}

export async function updateCompanyAboutInfo(
  id: string,
  updatedCompany: CompanyAboutInfo,
) {
  const endpoint: string = `/v1/company/update/description/${id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(updatedCompany),
  });
}

export async function registerStaff(newstaff: RegisterStaffModel) {
  const endpoint: string = `/v1/auth/staff/register`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(newstaff),
  });
}

export async function getCompanyDashboard(companyID: string) {
  const endpoint: string = `/v1/public/company/get/${companyID}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function updateStaff(staffID: string, staff: RegisterStaffModel) {
  const endpoint: string = `/v1/staff/update/${staffID}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(staff),
  });
}

export async function getCompanyByID(companyID: string) {
  const endpoint: string = `/v1/public/company/get/${companyID}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "GET",
  });
}

export async function addProduct(newProduct: ProductModel) {
  const entityType: string | null = localStorage.getItem("active_role");
  let endpoint: string = "";
  switch (entityType) {
    case "staff":
      endpoint = `/v1/offering/product/staff/add`;
      break;
    case "employer":
      endpoint = `/v1/offering/product/employer/add`;
      break;
    default:
      window.location.href = "/";
  }
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(newProduct),
  });
}

export async function addWearable(newItem: WearableModel) {
  const entityType: string | null = localStorage.getItem("active_role");
  let endpoint: string = "";
  switch (entityType) {
    case "staff":
      endpoint = `/v1/offering/wearable/staff/add`;
      break;
    case "employer":
      endpoint = `/v1/offering/wearable/employer/add`;
      break;
    default:
      window.location.href = "/";
  }
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(newItem),
  });
}

export async function updateProduct(id: string, product: ProductModel) {
  const entityType: string | null = localStorage.getItem("active_role");
  let endpoint: string = "";
  switch (entityType) {
    case "staff":
      endpoint = `/v1/offering/product/staff/update/${id}`;
      break;
    case "employer":
      endpoint = `/v1/offering/product/employer/update/${id}`;
      break;
    default:
      window.location.href = "/";
  }
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export async function updateWearable(id: string, item: WearableModel) {
  const entityType: string | null = localStorage.getItem("active_role");
  let endpoint: string = "";
  switch (entityType) {
    case "staff":
      endpoint = `/v1/offering/wearable/staff/update/${id}`;
      break;
    case "employer":
      endpoint = `/v1/offering/wearable/employer/update/${id}`;
      break;
    default:
      window.location.href = "/";
  }
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(item),
  });
}

export async function getEmployerProfile() {
  const response = await fetchAPIWithCredentials("/v1/employer/get/my-profile");

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      errorText || `Server returned status ${response.status}`,
    );
    (error as any).status = response.status; // attach status
    throw error;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function deleteProductById(id: string) {
  const entityType: string | null = localStorage.getItem("active_role");
  let endpoint: string = "";
  switch (entityType) {
    case "staff":
      endpoint = `/v1/offering/product/staff/delete/${id}`;
      break;
    case "employer":
      endpoint = `/v1/offering/product/employer/delete/${id}`;
      break;
    default:
      window.location.href = "/";
  }

  return await fetchAPIWithCredentials(endpoint, {
    method: "DELETE",
  });
}

export async function deleteWearableById(id: string) {
  const entityType: string | null = localStorage.getItem("active_role");
  let endpoint: string = "";
  switch (entityType) {
    case "staff":
      endpoint = `/v1/offering/wearable/staff/delete/${id}`;
      break;
    case "employer":
      endpoint = `/v1/offering/wearable/employer/delete/${id}`;
      break;
    default:
      window.location.href = "/";
  }

  return await fetchAPIWithCredentials(endpoint, {
    method: "DELETE",
  });
}

export async function getAllProducts() {
  const endpoint = "/v1/public/offering/product/get/all";
  return await fetchAPIWithoutCredentials(endpoint, { method: "GET" });
}

export async function getProductsByCompanyId(companyId: string) {
  const endpoint = `/v1/public/offering/get/product/company/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getWearablesByCompanyId(companyId: string) {
  const endpoint = `/v1/public/offering/get/wearable/company/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getProductById(id: string) {
  const endpoint = `/v1/public/offering/product/get/${id}`;
  return await fetchAPIWithoutCredentials(endpoint, { method: "GET" });
}

export async function getMovieById(id: string) {
  const endpoint = `/v1/public/offering/movie/get/${id}`;
  return await fetchAPIWithoutCredentials(endpoint, { method: "GET" });
}

export async function getBookById(id: string) {
  const endpoint = `/v1/public/offering/book/get/${id}`;
  return await fetchAPIWithoutCredentials(endpoint, { method: "GET" });
}

export async function getStaffByCompanyId(companyId: string) {
  const endpoint = `/v1/public/staff/get/all/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function addProductToCart(
  productId: string,
  quantity: number,
  companyId: string,
) {
  const endpoint = `/v1/user/cart/add/product/${productId}/${quantity}/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "POST" });
}

export async function addWearableToCart(
  itemId: string,
  quantity: number,
  companyId: string,
) {
  const endpoint = `/v1/user/cart/add/wearable/${itemId}/${quantity}/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "POST" });
}

export async function decrementCartItemQuantity(
  productId: string,
  quantity: number,
) {
  const endpoint = `/v1/user/cart/decrement/product/${productId}/${quantity}`;
  return await fetchAPIWithCredentials(endpoint, { method: "PUT" });
}

export async function getStaffProfile() {
  const endpoint: string = "/v1/staff/get/my-profile";
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getUserCartItems(userId: string) {
  const endpoint: string = `/v1/user/get/cart/${userId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getCompanyCartItems(userId: string, companyId: string) {
  const endpoint: string = `/v1/user/get/cart/${userId}/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function removeItemFromCart(itemId: string, companyId: string) {
  const endpoint: string = `/v1/user/delete/cart/item/${itemId}/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "DELETE" });
}

//TODO
export async function updateStaffProfile(
  staffId: string,
  staffProfile: { firstName: string; lastName: string },
) {
  const endpoint: string = `/v1/staff/update/${staffId}/profile`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(staffProfile),
  });
}

export async function updateStaffContact(
  staffId: string,
  contact: { email: string; phoneNumber: string },
) {
  const endpoint: string = `/v1/staff/update/${staffId}/contact`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(contact),
  });
}

export async function updateStaffAddress(
  staffId: string,
  address: AddressModel,
) {
  const endpoint: string = `/v1/staff/update/${staffId}/address`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(address),
  });
}

export async function updateStaffSecurity(
  staffId: string,
  credentials: { username: string; password: string },
) {
  const endpoint: string = `/v1/user/get/cart/${staffId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function offeringsUplaodImageRequest(
  imageMetadata: ImageMetadata[],
  offeringType: OfferingType,
  offeringId: string,
) {
  const endpoint: string = `/v1/image/upload/request`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify({ offeringType, offeringId, imageMetadata }),
  });
}

export async function offeringsUplaodImageConfirmation(
  offeringId: string,
  keys: string[],
) {
  const endpoint: string = `/v1/image/upload/confirm`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify({ offeringId, keys }),
  });
}

export async function updateProductImage(product: ProductModel) {
  const endpoint: string = `/v1/offering/product/update/image`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export async function updateWearableImage(item: WearableModel) {
  const endpoint: string = `/v1/offering/wearable/update/image`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(item),
  });
}

// Part 3 — After we upload the pictures to the S3 bucket, if everything goes well, we need to post the presign key to backend
export async function postOfferingImageKeys(
  requestData: OfferingImageUploadRequest,
) {
  const endpoint: string = "/v1/offering/image/upload/confirm";
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

export async function postCompanyImageKeys(
  requestData: CompanyImageUploadRequest,
) {
  const endpoint: string = "/v1/company/image/upload/confirm";
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

export async function updateCompanyImage(company: CompanyRegistrationModel) {
  const endpoint: string = `/v1/company/update/image`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(company),
  });
}

export async function getAllCompanies() {
  const endpoint: string = "/v1/public/company/get/all";
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function placeOrder(newOrder: PlaceOrderModel) {
  const endpoint: string = `/v1/user/order/create`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(newOrder),
  });
}

export async function getCartItem(itemId: string, companyId: string) {
  const endpoint: string = `/v1/user/get/cart/item/${itemId}/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getAllCompanyAndUserOrders(
  userId: string,
  companyId: string,
) {
  const endpoint: string = `/v1/user/order/get/all/${userId}/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getAllCompanyOrders(companyId: string) {
  const endpoint: string = `/v1/company/get/all/orders/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getAllUserOrders(userId: string) {
  const endpoint: string = `/v1/user/order/get/all/${userId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getOrder(
  userId: string,
  companyId: string,
  orderId: string,
) {
  const endpoint: string = `/v1/user/order/get/${userId}/${companyId}${orderId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getOrderItemById(itemId: string) {
  const endpoint: string = `/v1/user/order/get/item/${itemId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function updateEmplyerProfile(
  username: string,
  profile: { firstName: string; lastName: string },
) {
  const response = await fetchAPIWithCredentials(
    `/v1/employer/update/${username}/profile`,
    { method: "PUT", body: JSON.stringify(profile) },
  );
  return response;
}

export async function updateEmployerContact(
  username: string,
  contact: { email: string; phoneNumber: string },
) {
  const response = await fetchAPIWithCredentials(
    `/v1/employer/update/${username}/contact`,
    { method: "PUT", body: JSON.stringify(contact) },
  );
  return response;
}

export async function updateEmployerAddress(
  username: string,
  address: AddressModel,
) {
  const response = await fetchAPIWithCredentials(
    `/v1/employer/update/${username}/address`,
    { method: "PUT", body: JSON.stringify(address) },
  );
  return response;
}

export async function updateOrderStatus(orderId: string, status: string) {
  return fetchAPIWithCredentials(
    `/v1/user/order/update/${orderId}/status?status=${status}`,
    {
      method: "PUT",
    },
  );
}

export async function getAllWearables() {
  const endpoint = "/v1/public/offering/wearable/get/all";
  return await fetchAPIWithoutCredentials(endpoint, { method: "GET" });
}

export async function getWearableByCompanyId(companyId: string) {
  const endpoint = `/v1/public/offering/get/wearable/company/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, { method: "GET" });
}

export async function getWearableById(id: string) {
  const endpoint = `/v1/public/offering/wearable/get/${id}`;
  return await fetchAPIWithoutCredentials(endpoint, { method: "GET" });
}

export async function updateCredentials(
  id: string,
  newCredentials: { username: string; password: string },
) {
  const entityType: string | null = localStorage.getItem("active_role");
  let endpoint: string = "";
  switch (entityType) {
    case "user":
      endpoint = `/v1/user/update/${id}/credentials`;
      break;
    case "employer":
      endpoint = `/v1/employer/update/${id}/credentials`;
      break;
    case "staff":
      endpoint = `/v1/staff/update/${id}/credentials`;
      break;
    default:
      window.location.href = "/";
  }
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(newCredentials),
  });
}

export async function resetPasswordRequest(entity: entityType, email: string) {
  let endpoint: string = "";
  switch (entity) {
    case "employer":
      endpoint = `/v1/auth/employer/password/reset/request/${email}`;
      break;
    case "staff":
      endpoint = `/v1/auth/staff/password/reset/request/${email}`;
      break;
    default:
      endpoint = `/v1/auth/user/password/reset/request/${email}`;
      break;
  }
  return await fetchAPIWithoutCredentials(endpoint, { method: "POST" });
}

export async function resetPasswordConfirm(
  entity: entityType,
  email: string,
  mfaCode: string,
  newPassword: ResetPasswordRequest,
) {
  let endpoint: string = "";
  switch (entity) {
    case "employer":
      endpoint = `/v1/auth/employer/password/reset/confirm/${email}/${mfaCode}`;
      break;
    case "staff":
      endpoint = `/v1/auth/staff/password/reset/confirm/${email}/${mfaCode}`;
      break;
    default:
      endpoint = `/v1/auth/user/password/reset/confirm/${email}/${mfaCode}`;
      break;
  }

  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(newPassword),
  });
}

export async function updateCompanySchedule(
  companyId: string,
  schedule: WeeklySchedule,
) {
  const endpoint = `/v1/company/update/weekly-schedule/${companyId}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(schedule),
  });
}

export async function getAllInquiries() {
  const endpoint = "/v1/public/inquiry/get/all";
  return await fetchAPIWithoutCredentials(endpoint, { method: "GET" });
}

export async function postInquiryRequest(email: string) {
  const endpoint = `/v1/public/inquiry/post/request/${email}`;
  return await fetchAPIWithoutCredentials(endpoint, { method: "POST" });
}

export async function postInquiryConfirm(
  mfaCode: string,
  inquiry: InquiryModel,
) {
  const endpoint = `/v1/public/inquiry/post/confirm/${mfaCode}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(inquiry),
  });
}
