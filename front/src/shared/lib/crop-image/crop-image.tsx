import { Area } from 'react-easy-crop';

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
  });

export const getCroppedImg = async (
  imageSrc: string, 
  pixelCrop: Area, 
  rotation: number = 0
): Promise<string> => {
  const image = await createImage(imageSrc);
  
  if (rotation === 0) {
    // Simple case - no rotation
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Failed to get canvas context");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL("image/jpeg");
  } else {
    // Case with rotation
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2D context");

    const radians = (rotation * Math.PI) / 180;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) throw new Error("No 2D context");

    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));
    const rotatedWidth = image.width * cos + image.height * sin;
    const rotatedHeight = image.width * sin + image.height * cos;

    tempCanvas.width = rotatedWidth;
    tempCanvas.height = rotatedHeight;

    tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
    tempCtx.rotate(radians);
    tempCtx.drawImage(image, -image.width / 2, -image.height / 2);

    const imageData = tempCtx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL("image/jpeg");
  }
};