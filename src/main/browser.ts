import pie from "puppeteer-in-electron";
import { BrowserWindow, IpcMainEvent, app } from "electron";

const puppeteer = require("puppeteer-core");
const twofactor = require("node-2fa");

const TIKTOK_ADS_LOGIN_URL =
  "https://ads.tiktok.com/i18n/common_pages/guide_page/account_status";

export async function getBrowserAsync() {
  return await pie.connect(app, puppeteer);
}

export async function loginTiktokAds(
  ev: IpcMainEvent,
  account: TiktokAccount,
  proxy?: ProxyOption
) {
  ev.sender.send("login-tiktok-status", {
    uid: account.uid,
    pending: true,
  });
  const window = new BrowserWindow({
    webPreferences: {
      partition: account.uid,
    },
  });
  return getBrowserAsync()
    .then(async (browser) => {
      if (proxy) {
        const [ip, port] = proxy.address.split(":");
        window.webContents.addListener(
          "login",
          (ev, authRes, authInfo, callback) => {
            if (proxy.auth) {
              if (authInfo.host === ip && authInfo.port === +port) {
                const [username, password] = proxy.auth.split(":");
                callback(username, password);
                return;
              }
            }
            callback("", "");
          }
        );

        console.log("proxy", proxy);

        await window.webContents.session.setProxy({
          proxyRules: `${proxy.protocol}=${proxy.address}`,
        });
      } else {
        await window.webContents.session.setProxy({
          proxyRules: ``,
        });
      }
      try {
        await window.loadURL(TIKTOK_ADS_LOGIN_URL);
      } catch (e) {
        if (e.code !== "ERR_ABORTED") {
          throw e;
        }
      }

      const page = await pie.getPage(browser, window);

      await page.waitForSelector("input[name='email']", {
        timeout: 0,
      });
      await page.type("input[name='email']", account.email);
      await page.type("input[name='password']", account.password);
      await page.click("#TikTok_Ads_SSO_Login_Btn_new");
      const { token } = twofactor.generateToken(account.secret);

      await page.waitForSelector("#ac-sendcode-separate-input", { timeout: 0 });

      await page.type("#ac-sendcode-separate-input", token, {
        delay: 100,
      });
      await page.waitForNavigation({ timeout: 0 });
      ev.sender.send("login-tiktok-status", {
        uid: account.uid,
        success: true,
      });
    })
    .catch((e) => {
      window.loadURL(
        `data:text/html;charset=utf-8,<html><title>Error</title><body><pre>${
          (e as Error).stack
        }</pre></body></html>`
      );
      throw e;
    })
    .catch((err) => {
      ev.sender.send("login-tiktok-status", {
        uid: account.uid,
        error: err,
      });
    });
}
