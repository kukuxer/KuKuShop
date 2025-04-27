import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { FiX, FiCheck, FiRotateCcw } from "react-icons/fi";

interface ImageCropModalProps {
  image: string;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
  cropShape?: "rect" | "round";
}

const ImageCropModal = ({
  image,
  onClose,
  onSave,
  cropShape = "rect",
}: ImageCropModalProps) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
        onSave(croppedImage);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCroppedImg = (
    imageSrc: string,
    pixelCrop: Area,
    rotation: number = 0
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = "anonymous";

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No 2D context");

        const radians = (rotation * Math.PI) / 180;

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return reject("No 2D context");

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

        resolve(canvas.toDataURL("image/jpeg"));
      };

      image.onerror = () => reject("Failed to load image");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-xl bg-gray-900 p-6 shadow-2xl shadow-purple-500/20 border border-purple-500/20">
        <div className="h-[60vh] relative overflow-hidden rounded-lg">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={cropShape === "round" ? 1 : 3 / 1}
            onCropChange={setCrop}
            onZoomChange={(val) => setZoom(Number(val))}
            onCropComplete={onCropComplete}
            showGrid={true}
            cropShape={cropShape}
            classes={{
              containerClassName: "rounded-lg bg-gray-800 h-full",
              cropAreaClassName:
                cropShape === "round"
                  ? "border-4 border-purple-500 shadow-lg shadow-purple-400/30 rounded-full"
                  : "border-4 border-purple-500 shadow-lg shadow-purple-400/30",
            }}
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-2 w-32 rounded-lg appearance-none bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 hover:[&::-webkit-slider-thumb]:bg-purple-400"
            />
            <button
              onClick={() => setRotation((prev) => prev + 90)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Rotate image"
            >
              <FiRotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-900 text-white font-medium hover:from-red-600 hover:to-red-800 transition-colors flex items-center gap-2"
              aria-label="Cancel"
            >
              <FiX className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium hover:from-purple-500 hover:to-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiCheck className="w-5 h-5" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
