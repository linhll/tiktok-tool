// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onLoginTiktokStatus: (
    callback: (
      ev: IpcRendererEvent,
      payload: LoginTiktokStatusEventPayload
    ) => void
  ) => {
    ipcRenderer.addListener("login-tiktok-status", callback);
  },
  offLoginTiktokStatus: (
    callback: (
      ev: IpcRendererEvent,
      payload: LoginTiktokStatusEventPayload
    ) => void
  ) => {
    ipcRenderer.removeListener("login-tiktok-status", callback);
  },
  loginTiktokAds: (account: TiktokAccount, proxy?: ProxyOption) =>
    ipcRenderer.invoke("login-tiktok-ads", account, proxy),
});
