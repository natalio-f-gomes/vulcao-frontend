import {
  AddressModel,
  ENTITY_TYPE,
  FeedbackModel,
  ImageMetadata,
  ImageUploadRequest,
  PasswordRequest,
  USER_TYPE,
} from "../Interfaces/global";

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

export async function logoutEntity(entity: string) {
  const endpoint: string = `/v2/${entity.toLowerCase()}/logout`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
  });
}

export async function getProfile(entity: USER_TYPE) {
  const endpoint: string = `/v2/${entity.toLowerCase()}/get/profile`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "GET",
  });
}

export async function updateName(
  entity: USER_TYPE,
  name: {
    firstName: string;
    lastName: string;
  },
) {
  const endpoint: string = `/v2/${entity.toLowerCase()}/update/name`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(name),
  });
}

export async function updateContact(
  entity: USER_TYPE,
  contact: {
    email: string;
    phoneNumber: string;
  },
) {
  const endpoint: string = `/v2/${entity.toLowerCase()}/update/contact`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(contact),
  });
}

export async function updateAddress(entity: USER_TYPE, address: AddressModel) {
  const endpoint: string = `/v2/${entity.toLowerCase()}/update/address`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(address),
  });
}

export async function updateCredentials(
  entity: USER_TYPE,
  credentials: {
    username: string;
    password: string;
  },
) {
  const endpoint: string = `/v2/${entity.toLowerCase()}/update/credentials`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(credentials),
  });
}

export async function ResetPasswordRequest(entity: USER_TYPE, email: string) {
  const endpoint = `/v2/auth/${entity.toLowerCase()}/reset/password/request/${email}`;
  return await fetchAPIWithoutCredentials(endpoint, { method: "PUT" });
}

export async function ResetPasswordConfirm(
  entity: USER_TYPE,
  email: string,
  code: string,
  newPassword: PasswordRequest,
) {
  const endpoint = `/v2/auth/${entity.toLowerCase()}/reset/password/confirm/${email}/${code}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(newPassword),
  });
}

export async function postImageKeys(requestData: ImageUploadRequest) {
  const endpoint: string = "/v2/image/upload/confirm";
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

export async function updateImageRequest(
  entity_id: string,
  entityType: ENTITY_TYPE,
  imagesMetadata: ImageMetadata[],
) {
  console.log(imagesMetadata);
  const endpoint: string = `/v2/image/update/${entityType}/${entity_id}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "PUT",
    body: JSON.stringify(imagesMetadata),
  });
}

//============ Feedback Section ==============
export async function PostFeedBackRequest(newFeedback: FeedbackModel) {
  const endpoint: string = `/v2/public/feedback/request`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(newFeedback),
  });
}

export async function PostFeedBackConfirm(
  code: string,
  feedback: FeedbackModel,
) {
  const endpoint: string = `/v2/public/feedback/confirm/${code}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(feedback),
  });
}

export async function GetAllFeedbacks() {
  const endpoint: string = `/v2/public/feedback/get/all`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "GET",
  });
}
