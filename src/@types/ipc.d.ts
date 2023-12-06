type IPCMainMessagePayload = {
  type: "message";
};

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

interface BypassCaptchaResponseSuccess {
  bounds: Rect[];
  label: string;
  imageSize: Size;
  success: true;
  error: false;
}

interface BypassCaptchaResponseFailed {
  error: boolean;
  reload: boolean;
  success: false;
}

type BypassCaptchaResponseType =
  | BypassCaptchaResponseSuccess
  | BypassCaptchaResponseFailed;
