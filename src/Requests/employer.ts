import { LoginModel, RegistrationModel } from "../Interfaces/Authentication";
import { fetchAPIWithCredentials, fetchAPIWithoutCredentials } from "./global";

export const employerRegisterRequest = async (
  username: string,
  email: string,
) => {
  const endpoint = `/v2/auth/employer/register/request/${username}/${email}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
  });
};

export const employerRegisterConfirm = async (
  mfaCode: string,
  user: RegistrationModel,
) => {
  const endpoint = `/v2/auth/employer/register/confirm/${mfaCode}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(user),
  });
};

export async function employerLoginRequest(username: string) {
  const endpoint: string = `/v2/auth/employer/login/request/${username}`;
  return await fetchAPIWithoutCredentials(endpoint, {
    method: "POST",
  });
}

export async function employerLoginConfirm(
  mfaCode: string,
  userData: LoginModel,
) {
  const endpoint: string = `/v2/auth/employer/login/confirm/${mfaCode}`;
  return await fetchAPIWithCredentials(endpoint, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function getEmployerProfileData() {
  const response = await fetchAPIWithCredentials(`/v2/employer/get/profile`);

  if (!response.ok) {
    console.log(`Server returned status code ${response.status}`);
  }

  // Handle empty or whitespace-only response bodies safely
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function getEmployerBusisnesses() {
  return await fetchAPIWithCredentials(`/v2/employer/get/businesses`);
}
