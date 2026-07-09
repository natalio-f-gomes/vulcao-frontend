import { AddressModel } from "./global";

export interface RegistrationModel extends ProfileModel {
  password: string;
}

export interface LoginModel {
  username: string;
  password: string;
}

export interface ProfileModel {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  address?: AddressModel;
  phoneNumber?: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
