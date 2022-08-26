import { request } from "@src/apis";
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

type IResUrl = {
  image: string[];
  success: boolean;
};

export const useImageInput = (maxLimit: number) => {
  const [imgUrl, setImgUrl] = useState<string[]>([]);

  useEffect(() => {
    return imgUrl.forEach((image) => URL.revokeObjectURL(image));
  }, []);

  const addImages = async (files: FileList) => {
    const length = files.length;
    if (!checkMaxLimit(length)) {
      alert(`사진은 최대 ${maxLimit}개까지 첨부 가능합니다.`);
      return;
    }

    let newImages: string[] = [];
    const formData = new FormData();
    for (let i = 0; i < length; i++) {
      const file = files[i];

      if (validFileType(file)) {
        // const url = URL.createObjectURL(file);
        // newImages.push(url);

        formData.append("image", file);
      } else {
        alert(`적절한 파일 형식이 아닙니다.`);
      }
    }

    const { image } = await request<IResUrl>("/image", {
      method: "POST",
      body: formData,
      headers: undefined,
    });
    newImages = [...newImages, ...image];

    setImgUrl((state) => [...state, ...newImages]);
  };

  const deleteImage = (index: number) => {
    setImgUrl((state) => {
      const images = [...state];
      images.splice(index, 1);

      return images;
    });
  };

  const validFileType = (file: File) => {
    return IMG_TYPES.includes(file.type);
  };

  const checkMaxLimit = (length: number) => {
    const left = maxLimit - imgUrl.length;
    return left >= length;
  };

  return { imgUrl, addImages, deleteImage };
};
