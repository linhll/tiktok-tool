declare interface Window {
  electronAPI: {
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

    loginTiktokAds: (
      account: TiktokAccount,
      proxy?: ProxyOption
    ) => Promise<any>;
  };
}
