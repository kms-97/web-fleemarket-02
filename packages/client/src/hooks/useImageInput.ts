import { useEffect, useState } from "react";

const IMG_TYPES = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon",
];

export const useImageInput = (maxLimit: number) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    return images.forEach((image) => URL.revokeObjectURL(image));
  }, []);

  const addImages = (files: FileList) => {
    const length = files.length;
    if (!checkMaxLimit(length)) {
      alert(`사진은 최대 ${maxLimit}개까지 첨부 가능합니다.`);
      return;
    }

    const newImages: string[] = [];

    for (let i = 0; i < length; i++) {
      const file = files[i];

      if (validFileType(file)) {
        const url = URL.createObjectURL(file);
        newImages.push(url);
      } else {
        alert(`적절한 파일 형식이 아닙니다.`);
      }
    }

    setImages((state) => [...state, ...newImages]);
  };

  const deleteImage = (index: number) => {
    setImages((state) => {
      const images = [...state];
      images.splice(index, 1);

      return images;
    });
  };

  const validFileType = (file: File) => {
    return IMG_TYPES.includes(file.type);
  };

  const checkMaxLimit = (length: number) => {
    const left = maxLimit - images.length;
    return left >= length;
  };

  return { images, addImages, deleteImage };
};
