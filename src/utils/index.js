// import { validator } from "container-validator";
import { v4 } from "uuid";
import moment from "moment";
import ContainerValidator from "./containerValidator";

export const acceptedVideo = [
  "video/mp4",
  "video/x-m4v",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-ms-wmv",
];
export const acceptedImage = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/svg+xml",
  "image/webp",
];

export const uuid = () => v4();

export const checkISOContainer = value => {
  const validator = new ContainerValidator();
  return validator.isValid(value);
};

export const drawImageText = (file, config, fileName) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.onload = function () {
      // const ratio = img.width / img.height;

      const height = (config && config.height) || 840;
      // const width = config.width * ratio;
      const width = (config && config.width) || 632;

      // console.log(ratio, height, width);

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);
      ctx.font = "500 20px Calibri";
      ctx.fillStyle = "#920000";
      ctx.fillText(moment().format("Y.MM.DD  HH:mm"), 20, height - 30);
      canvas.toBlob(
        blob => {
          const newFile = new File([blob], fileName || file.name);
          resolve(newFile);
        },
        "image/jpeg",
        0.8
      );
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const to2num = num => {
  return num <= 9 ? `0${num}` : num;
};

export const base64ToFile = (url, fileName) => {
  let arr = url.split(",");

  let mime = arr[0].match(/:(.*?);/)[1];
  let data = arr[1];

  let dataStr = atob(data);
  let n = dataStr.length;
  let dataArr = new Uint8Array(n);

  while (n--) {
    dataArr[n] = dataStr.charCodeAt(n);
  }

  let file = new File([dataArr], fileName, { type: mime });

  return file;
};
