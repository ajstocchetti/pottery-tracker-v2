import { useEffect, useState } from "react";
import { loadImages, saveImage } from "src/data";
import { Image } from "src/interfaces";
import ImageCard from "./image-card";

export default function Images() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    loadImageAsyncHandler();
  }, []);

  async function loadImageAsyncHandler() {
    const images = await loadImages();
    setImages(images);
  }

  function onUpdate(imageIndex: number) {
    return async function (image: Image) {
      const next = [...images];
      const img = await saveImage(image);
      if (img) next[imageIndex] = img;
      setImages(next);
    };
  }

  return images.map((image, index) => (
    <ImageCard
      key={image.fileName}
      image={image}
      onChange={onUpdate(index)}
      onDelete={loadImageAsyncHandler}
    />
  ));
}
