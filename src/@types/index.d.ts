interface ElectronAPI {
  onLoginTiktokStatus: (
    callback: (
      ev: IpcRendererEvent,
      payload: LoginTiktokStatusEventPayload
    ) => void
  ) => void;
  offLoginTiktokStatus: (
    callback: (
      ev: IpcRendererEvent,
      payload: LoginTiktokStatusEventPayload
    ) => void
  ) => void;
  onByPassCaptcha: (
    callback: (
      ev: IpcRendererEvent,
      payload: {
        id: string;
        src: string;
      }
    ) => void
  ) => void;
  offByPassCaptcha: (
    callback: (
      ev: IpcRendererEvent,
      payload: {
        id: string;
        src: string;
      }
    ) => void
  ) => void;
  sendBypassCaptchaResponse: (id: string, payload: any) => void;
  loginTiktokAds: (account: TiktokAccount, proxy?: ProxyOption) => Promise<any>;
  getDeviceId: () => Promise<string>;
}

declare interface Window {
  electronAPI: ElectronAPI;
}

declare var electronAPI: ElectronAPI;
