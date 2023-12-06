import { BrowserWindow, WebContents, IpcMainEvent, app, Menu } from "electron";
import { Browser } from "puppeteer-core";
import pie from "puppeteer-in-electron";
import { delay } from "./utils/task";
import EventEmitter from "events";

const puppeteer = require("puppeteer-core");
const twofactor = require("node-2fa");

const TIKTOK_ADS_LOGIN_URL =
  "https://ads.tiktok.com/i18n/common_pages/guide_page/account_status";
const TIKTOK_PAYMENT_URL = "https://ads.tiktok.com/i18n/account/payment";
const CAMPAIGN_URL = "https://ads.tiktok.com/i18n/perf/campaign";

export default class AcceptBCHandler {
  static emitter = new EventEmitter();

  static addEventListener(event: string, listener: (payload: any) => void) {
    this.emitter.on(event, listener);
    return () => {
      this.emitter.off(event, listener);
    };
  }

  mainWebContent: WebContents;
  account: TiktokAccount;
  proxy?: ProxyOption;
  private _businessId?: string;
  public get businessId() {
    return this._businessId;
  }
  private set businessId(value: string | undefined) {
    this._businessId;
    const item = this._menu.getMenuItemById("goto-campaign");
    if (item) {
      item.enabled = !!value;
    }
  }
  window: BrowserWindow;

  browserPromise: Promise<Browser>;
  private _menu: Menu;

  constructor(
    webContent: WebContents,
    account: TiktokAccount,
    proxy?: ProxyOption
  ) {
    this.mainWebContent = webContent;
    this.account = account;
    this.proxy = proxy;

    this.window = new BrowserWindow({
      webPreferences: {
        partition: this.account.uid,
      },
    });

    this._menu = this._buildMenu();
    this.window.setMenu(this._menu);

    this._setupWindow();
    this.browserPromise = pie.connect(app, puppeteer);
  }

  getBrowserAsync() {
    return this.browserPromise;
  }

  async getPage() {
    const browser = await this.getBrowserAsync();
    return await pie.getPage(browser, this.window);
  }

  private async _bypassCaptchaAsync() {
    try {
      const page = await this.getPage();
      while (true) {
        const img = await page.waitForSelector("#captcha-verify-image", {
          timeout: 0,
        });
        if (!img) {
          continue;
        }
        console.log("captcha detected");
        const src = String(await (await img.getProperty("src")).jsonValue());
        const bypassResponse = await this._sendByPassRequest(src);
        if (!bypassResponse.success) {
          if (bypassResponse.error && bypassResponse.reload) {
            await page.click(".secsdk_captcha_refresh");
            console.log("reload captcha", bypassResponse);

            await delay(250);
            continue;
          }
          throw new Error("bypass captcha error");
        }

        const size = bypassResponse.imageSize;
        const boundingBox = await img.boundingBox();
        if (!boundingBox) {
          continue;
        }
        const ratio = boundingBox.width / size.width;

        for (const bound of bypassResponse.bounds) {
          const cx = boundingBox.x + (bound.x + bound.width / 2) * ratio;
          const cy = boundingBox.y + (bound.y + bound.height / 2) * ratio;

          await page.mouse.click(cx, cy);
          await delay(250);
        }

        // verify-captcha-submit-button
        await page.click(".verify-captcha-submit-button");
        await delay(2000);
      }
    } catch (err: any) {
      console.error(err.code, err.message);
    }
  }

  private _sendByPassRequest(captchaUrl: string) {
    return new Promise<BypassCaptchaResponseType>((resolve, reject) => {
      const unsubscribe = AcceptBCHandler.addEventListener(
        "bypass-captcha-response",
        (data: { id: string; payload: BypassCaptchaResponseType }) => {
          if (data.id == this.account.uid) {
            unsubscribe();
            resolve(data.payload);
          }
        }
      );
      //
      this.mainWebContent.send("bypass-captcha", {
        src: captchaUrl,
        id: this.account.uid,
      });
    });
  }

  async autoAcceptAsync() {
    await this.loginAsync();
    await this.acceptBC();
  }

  async loginAsync() {
    const browser = await this.getBrowserAsync();
    for (let i = 0; i < 5; i++) {
      try {
        await this.window.loadURL(TIKTOK_ADS_LOGIN_URL);

        break;
      } catch (e: any) {
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
    const page = await pie.getPage(browser, this.window);
    this._bypassCaptchaAsync();
    if (page.url() === "https://ads.tiktok.com/i18n/home") {
      await page.waitForNavigation();
    }
    this.mainWebContent.send("login-tiktok-status", {
      uid: this.account.uid,
      pending: true,
      action: "check url",
    });
    if (!/aadvid=\d+/.test(page.url())) {
      try {
        this.mainWebContent.send("login-tiktok-status", {
          uid: this.account.uid,
          pending: true,
          action: "loging in",
        });
        await page.waitForSelector("input[name='email']");
        await page.type("input[name='email']", this.account.email);
        await page.type("input[name='password']", this.account.password);
        await page.click("#TikTok_Ads_SSO_Login_Btn_new");

        const { token } = twofactor.generateToken(this.account.secret);

        await page.waitForSelector("#ac-sendcode-separate-input", {
          timeout: 0,
        });

        await page.type("#ac-sendcode-separate-input", token, {
          delay: 100,
        });
        await page.waitForNavigation({ timeout: 0 });
      } catch {}
    }
  }

  async acceptBC() {
    const page = await this.getPage();
    await page.waitForFunction("/\\?aadvid=[0-9]+/.test(location.search)");
    const businessId = /aadvid=\d+/
      .exec(page.url())?.[0]
      .substring("aadvid=".length);
    let hasInvitation = false;
    this.businessId = businessId;
    if (businessId) {
      await this.window.loadURL(`${TIKTOK_PAYMENT_URL}?aadvid=${businessId}`);
      this.mainWebContent.send("login-tiktok-status", {
        uid: this.account.uid,
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
        this.mainWebContent.send("login-tiktok-status", {
          uid: this.account.uid,
          success: true,
        });
      }
    }
  }

  async _gotoCampaign() {
    // const page = await this.getPage();
    await this.window.loadURL(`${CAMPAIGN_URL}?aadvid=${this.businessId}`);
  }

  async _setupWindow() {
    this.window.webContents.session.setPermissionRequestHandler(
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
    this.window.webContents.setWindowOpenHandler(() => {
      return { action: "deny" };
    });
    if (this.proxy) {
      const [ip, port] = this.proxy.address.split(":");
      this.window.webContents.addListener(
        "login",
        (ev, authRes, authInfo, callback) => {
          if (this.proxy?.auth) {
            if (authInfo.host === ip && authInfo.port === +port) {
              const [username, password] = this.proxy.auth.split(":");
              callback(username, password);
              return;
            }
          }
          callback("", "");
        }
      );

      await this.window.webContents.session.setProxy({
        proxyRules: `${this.proxy.protocol}://${this.proxy.address}`,
      });
    } else {
      await this.window.webContents.session.setProxy({
        proxyRules: "",
      });
    }
  }

  private _buildMenu() {
    const template: (
      | Electron.MenuItemConstructorOptions
      | Electron.MenuItem
    )[] = [
      {
        label: "Actions",
        submenu: [
          {
            id: "goto-campaign",
            label: "Goto Campaign",
            enabled: !!this.businessId,
            click: () => this._gotoCampaign(),
          },
        ],
      },
    ];
    return Menu.buildFromTemplate(template);
  }
}
