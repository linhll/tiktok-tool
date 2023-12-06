import { Tokens, User } from "@ui/models/auth";
import request from "./base";

function loginWithIdToken(idToken: string) {
  return request<{ tokens: Tokens; user: User }>({
    url: "/auth/login",
    method: "POST",
    data: {
      idToken,
    },
  });
}

function logout() {
  return request<any>({
    url: "/auth/logout",
    method: "POST",
  });
}

export default Object.freeze({
  loginWithIdToken,
  logout,
});
