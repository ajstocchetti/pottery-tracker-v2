import { Select } from "antd";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { loadImages, saveImage } from "src/data";
import { Image, SelectOptions } from "src/interfaces";
import { state } from "src/store/valio";
import ImageCard from "./image-card";

const filterOptions: SelectOptions = [
  { label: "Need Pieces", value: "NEED_PIECES" },
  { label: "All Pieces Set", value: "FULL" },
  { label: "Inspiration", value: "INSPIRATION" },
  { label: "All", value: "ALL" },
];

export default function Images() {
  const { imageListFilter } = useSnapshot(state);
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    loadImageAsyncHandler();
  }, [imageListFilter]);

  async function loadImageAsyncHandler() {
    const images = await loadImages(imageListFilter);
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

  function setFilter(filterVal: string) {
    state.imageListFilter = filterVal;
  }

  return (
    <div>
      <Select
        value={imageListFilter}
        onChange={setFilter}
        options={filterOptions}
        style={{ minWidth: 300, marginBottom: "1rem" }}
      />
      {images.map((image, index) => (
        <ImageCard
          key={image.fileName}
          image={image}
          onChange={onUpdate(index)}
          onDelete={loadImageAsyncHandler}
        />
      ))}
    </div>
  );
}
