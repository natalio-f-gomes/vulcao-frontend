import { ProfileModel } from "../../../Interfaces/Authentication";
import { OrderModel } from "../../../Interfaces/global";

export interface ClientOrderDisplay {
  client: ProfileModel;
  order: OrderModel;
}
