import { BrowserWindow } from "electron/main";

export default class WindowManager{
    private static _mainWindow?: BrowserWindow;
    public static get mainWindow(){
        return this._mainWindow
    };

    public static setMainWindow(window?: BrowserWindow){
        this._mainWindow = window;
    }

}