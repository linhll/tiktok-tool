import request from "./base";
import { User } from "@ui/models/auth";

function getUserInfo() {
  return request<User>({
    url: "/account/info",
  });
}

export default Object.freeze({
  getUserInfo,
});
