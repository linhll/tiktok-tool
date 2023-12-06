import { Provision, Wallet } from "@ui/models/wallet";
import request from "./base";

function getWalletInfo() {
  return request<Wallet>({
    url: "/wallet",
  });
}

function createProvision(amount: number) {
  return request<Provision>({
    url: "/wallet/provisions",
    method: "POST",
    data: {
      amount,
    },
  });
}

export default Object.freeze({ getWalletInfo, createProvision });
