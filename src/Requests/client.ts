import { LoginModel, RegistrationModel } from "../Interfaces/Authentication";
import { OrderRequest } from "../Interfaces/global";
import { fetchAPIWithCredentials, fetchAPIWithoutCredentials } from "./global";

export const clientRegisterRequest = async (
  username: string,
  email: string,
) => {
  const endpoint = `/v2/auth/client/register/request/${username}/${email}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
  });
};

export const clientRegisterConfirm = async (
  mfaCode: string,
  user: RegistrationModel,
) => {
  const endpoint = `/v2/auth/client/register/confirm/${mfaCode}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(user),
  });
};

export async function clientLoginRequest(username: string) {
  const endpoint: string = `/v2/auth/client/login/request/${username}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
  });
}

export async function clientLoginConfirm(
  mfaCode: string,
  userData: LoginModel,
) {
  const endpoint: string = `/v2/auth/client/login/confirm/${mfaCode}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function getUserProfileData() {
  const response = await fetchAPIWithCredentials(`/v2/client/get/profile`);

  if (!response.ok) {
    console.log(`Server returned status code ${response.status}`);
  }
  if (response.status === 200) {
    return await response.json();
  }
  return await response.text();
}

export async function GetClientById(id: string) {
  const endpoint: string = `/v2/public/client/get/${id}`;
  return await fetchAPIWithoutCredentials(endpoint, { method: "GET" });
}
