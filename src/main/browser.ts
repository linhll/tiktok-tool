import pie from "puppeteer-in-electron";
import { IpcMainInvokeEvent, app } from "electron";
import AcceptBCHandler from "./accept-bc-handler";

export async function loginTiktokAds(
  ev: IpcMainInvokeEvent,
  account: TiktokAccount,
  proxy?: ProxyOption
) {
  const handler = new AcceptBCHandler(ev.sender, account, proxy);

  handler.autoAcceptAsync();
}
