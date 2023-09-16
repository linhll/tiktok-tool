import pie from "puppeteer-in-electron";
import { BrowserWindow, IpcMainEvent, app } from "electron";

const puppeteer = require("puppeteer-core");
const twofactor = require("node-2fa");

// const TIKTOK_ADS_LOGIN_URL = "https://google.com";
const TIKTOK_ADS_LOGIN_URL =
  "https://ads.tiktok.com/i18n/common_pages/guide_page/account_status";
const TIKTOK_PAYMENT_URL =
  "https://ads.tiktok.com/i18n/account/payment?aadvid=";

export async function getBrowserAsync() {
  return await pie.connect(app, puppeteer);
}

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
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

  window.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      const parsedUrl = new URL(webContents.getURL());

      if (permission === "notifications") {
        // Approves the permissions request
        callback(true);
      }

      // Verify URL
      if (parsedUrl.protocol !== "https:") {
        // Denies the permissions request
        return callback(false);
      }
    }
  );

  // window.webContents.addListener
  return getBrowserAsync()
    .then(async (browser) => {
      if (proxy) {
        const [ip, port] = proxy.address.split(":");
        window.webContents.addListener(
          "login",
          (ev, authRes, authInfo, callback) => {
            console.log("authInfo", authInfo);
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

        await window.webContents.session.setProxy({
          proxyRules: `${proxy.protocol}://${proxy.address}`,
        });
      } else {
        await window.webContents.session.setProxy({
          proxyRules: "",
        });
      }
      for (let i = 0; i < 5; i++) {
        try {
          await window.loadURL(TIKTOK_ADS_LOGIN_URL);

          break;
        } catch (e) {
          console.log(e.code);
          if (e.code === "ERR_CONNECTION_RESET") {
            await delay(1000);
            continue;
          }
          if (e.code !== "ERR_ABORTED") {
            throw e;
          }
          break;
        }
      }

      const page = await pie.getPage(browser, window);

      if (page.url() === "https://ads.tiktok.com/i18n/home") {
        await page.waitForNavigation();
      }

      ev.sender.send("login-tiktok-status", {
        uid: account.uid,
        pending: true,
        action: "check url",
      });

      if (!/aadvid=\d+/.test(page.url())) {
        try {
          ev.sender.send("login-tiktok-status", {
            uid: account.uid,
            pending: true,
            action: "loging in",
          });
          await page.waitForSelector("input[name='email']");
          await page.type("input[name='email']", account.email);
          await page.type("input[name='password']", account.password);
          await page.click("#TikTok_Ads_SSO_Login_Btn_new");
          try {
            await page.waitForSelector("#captcha-verify-image");
          } catch (e) {
            //
          }

          const { token } = twofactor.generateToken(account.secret);

          await page.waitForSelector("#ac-sendcode-separate-input", {
            timeout: 0,
          });

          await page.type("#ac-sendcode-separate-input", token, {
            delay: 100,
          });
          await page.waitForNavigation({ timeout: 0 });
        } catch {
          //
        }
      }
      ev.sender.send("login-tiktok-status", {
        uid: account.uid,
        pending: true,
        action: "navigate",
      });
      await page.waitForFunction("/\\?aadvid=[0-9]+/.test(location.search)");
      const businessId = /aadvid=\d+/
        .exec(page.url())[0]
        .substring("aadvid=".length);
      let hasInvitation = false;
      if (businessId) {
        await window.loadURL(`${TIKTOK_PAYMENT_URL}${businessId}`);
        ev.sender.send("login-tiktok-status", {
          uid: account.uid,
          pending: true,
          action: "checking",
        });
        hasInvitation = await page
          .waitForSelector(".go-accept.action")
          .then(() => true)
          .catch(() => false);
        if (hasInvitation) {
          Promise.resolve()
            .then(async () => {
              await page.waitForSelector("byted-wc-button", { timeout: 10000 });
              await delay(1000);
              await page.click("byted-wc-button");
            })
            .catch(console.log);
          await delay(2000);
          await page
            .evaluate(
              `document.querySelectorAll('.v-modal').forEach(el => el.remove())`
            )
            .finally();
          await page
            .evaluate(
              `document.querySelectorAll('.ac-info-remind-dialog-setting__wrapper').forEach(el => el.remove())`
            )
            .finally();
          await page.click(".go-accept.action");
          // const _t = setInterval(async () => {
          //   await page
          //     .evaluate(
          //       `document.querySelectorAll('.v-modal').forEach(el => el.remove())`
          //     )
          //     .finally();
          //   await page
          //     .evaluate(
          //       `document.querySelectorAll('.ac-info-remind-dialog-setting__wrapper').forEach(el => el.remove())`
          //     )
          //     .finally();
          //   await page.click(".go-accept.action");
          // }, 3000);
          console.log("wait accept button");

          await page
            .waitForSelector(".invite-accept-request-action")
            .finally(() => {
              // clearInterval(_t);
            });
          await delay(1000);

          console.log("click accept button");
          await page.click(".invite-accept-request-action");
          try {
            await page.waitForFunction(
              `document.querySelector(".title").innerText == 'You have accepted the request'`,
              {
                timeout: 10000,
              }
            );
          } catch (e) {
            console.error(e);
          }
          ev.sender.send("login-tiktok-status", {
            uid: account.uid,
            success: true,
          });
          return;
        }
      }
    })
    .catch((e) => {
      // window.loadURL(
      //   `data:text/html;charset=utf-8,<html><title>Error</title><body><pre>${
      //     (e as Error).stack
      //   }</pre><button onclick="history.back()">back</button></body></html>`
      // );
      throw e;
    })
    .catch((err) => {
      ev.sender.send("login-tiktok-status", {
        uid: account.uid,
        error: err,
      });
    });
}
