import cv from "@techstark/opencv-js";

function erodeShape(img: cv.Mat) {
  // cv.bitwise_not(img, img);
  const M = cv.Mat.ones(2, 2, cv.CV_8U);
  cv.dilate(img, img, M);
  // cv.bitwise_not(img, img);
  // @ts-ignore
  M.delete();
}

function convertToBlackWhite(img: cv.Mat) {
  let res = new cv.Mat();
  cv.convertScaleAbs(img, res, 1.25, 2);
  cv.cvtColor(res, res, cv.COLOR_RGB2GRAY);
  cv.threshold(res, res, 250, 255, cv.THRESH_BINARY);
  erodeShape(res);
  return res;
}

function isInner(a: cv.Rect, b: cv.Rect) {
  if (a == b) {
    return false;
  }

  const area_a = a.width * a.height;
  const area_b = b.width * b.height;
  if (area_a >= area_b) {
    return false;
  }
  return (
    a.x >= b.x &&
    a.x + a.width <= b.x + b.width &&
    a.y >= b.y &&
    a.y + a.height <= b.y + b.height
  );
}

function innerFilter(arr: cv.Rect[]) {
  return arr.filter((rect) => {
    return !arr.find((item) => isInner(rect, item));
  });
}

export default function (url: string) {
  return new Promise<{
    bounds: cv.Rect[];
    images: cv.Mat[];
    size: {
      width: number;
      height: number;
    };
  }>((resolve, reject) => {
    const imgSource = new Image();
    imgSource.src = url;
    imgSource.onload = (ev) => {
      const img = cv.imread(imgSource);
      const res = convertToBlackWhite(img);
      // const dst = cv.Mat.zeros(res.rows, res.cols, cv.CV_8UC3);
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(
        res,
        contours as any,
        hierarchy,
        cv.RETR_TREE,
        cv.CHAIN_APPROX_SIMPLE
      );

      // for(let )
      // cv.contourArea()
      const maxArea = (res.rows * res.cols) / 2;

      let arr: cv.Rect[] = [];
      for (let i = 0; i < contours.size(); ++i) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);
        if (area >= 200 && area < maxArea) {
          arr.push(cv.boundingRect(contour));
        }
      }
      arr = innerFilter(arr);
      const images = arr.map((rect) => {
        const subImg = res.roi(rect);
        cv.resize(subImg, subImg, new cv.Size(48, 64));
        return subImg;
      });

      // arr.forEach((rect) => {
      //   const color = new cv.Scalar(0);
      //   cv.rectangle(
      //     res,
      //     {
      //       x: rect.x,
      //       y: rect.y,
      //     },
      //     {
      //       x: rect.x + rect.width,
      //       y: rect.y + rect.height,
      //     },
      //     color,
      //     1,
      //     cv.LINE_8,
      //   );
      // });

      resolve({
        bounds: arr,
        images,
        size: {
          width: img.cols,
          height: img.rows,
        },
      });
    };
    imgSource.onerror = reject;
  });
}
