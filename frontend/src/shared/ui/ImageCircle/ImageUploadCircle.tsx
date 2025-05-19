import { useState } from "react";
import { Icon } from "../Icon";

interface ImageCircleProps {
  imageUrl?: string;
  alt?: string;
  onClick?: () => void;
}

export const ImageUploadCircle = ({
  imageUrl,
  alt,
  onClick,
}: ImageCircleProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <div
        className={`relative w-32 h-32 font-cafe24 rounded-full overflow-hidden ${
          imageError ? "bg-error text-error" : "bg-neutral900"
        } text-neutral1000 flex justify-center items-center`}
      >
        {!imageUrl ? (
          <div className="text-neutral700 text-center font-black leading-4 text-sm">
            UPLOAD
            <br />
            IMAGE
          </div>
        ) : imageError ? (
          <>
            <Icon icon="broken_image" fill tone="white" size={48} />
          </>
        ) : (
          <>
            <div className="absolute w-full h-full flex items-center justify-center bg-neutral1000/70 text-neutral600 text-center font-black leading-4 text-sm">
              UPLOAD
              <br />
              IMAGE
            </div>
            <img
              src={imageUrl}
              alt={alt}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          </>
        )}
      </div>
      <div className="absolute bottom-0 right-0 -translate-x-3 -translate-y-1 rounded-full p-1.5 flex bg-neutral600">
        <Icon icon="photo_camera" fill tone="white" size={20} />
      </div>
    </div>
  );
};
