import axios from "axios";
import imageProcessing from "./image-processing";
import cv from "@techstark/opencv-js";
import _ from "lodash";
import Exception from "../../exceptions";
import request from "@ui/api/base";

export function bypassTikTokCaptcha(imgSource: string) {
  return imageProcessing(imgSource).then((imgProcessedResult) => {
    console.log(imgProcessedResult);
    if (imgProcessedResult.images.length !== 7) {
      throw new Exception("process-failed");
    }

    return request<any>({
      url: "/tiktok-captcha/bypass",
      method: "POST",
      data: imgProcessedResult.images.map((item) => Array.from(item.data)),
    }).then((data) => {
      if (data.results) {
        return {
          bounds: data.results.map((i: number) => imgProcessedResult.bounds[i]),
          label: data.label,
          imageSize: imgProcessedResult.size,
          success: true,
        };
      }
      return {
        success: false,
      };
    });
  });
}
