import { Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { loadImages, saveImage } from "src/data";
import { Image, SelectOptions } from "src/interfaces";
import { state } from "src/store/valio";
import ImageCard from "./image-card";

const filterOptions: SelectOptions = [
  { label: "Need Pieces", value: "NEED_PIECES" },
  { label: "All Pieces Set", value: "FULL" },
  { label: "All", value: "ALL" },
];

export default function Images() {
  const { imageListFilter } = useSnapshot(state);
  const [images, setImages] = useState<Image[]>([]);
  const [numImagesToShow, setNumImagesToShow] = useState<number>(5);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadImageAsyncHandler();
  }, [imageListFilter]);

  async function loadImageAsyncHandler() {
    const images = await loadImages(imageListFilter);
    setImages(images);
    setNumImagesToShow(5);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && numImagesToShow < images.length) {
          setNumImagesToShow((prev) => prev + 3);
        }
      },
      { threshold: 0.1 }
    );

    if (listEndRef.current) {
      observer.observe(listEndRef.current);
    }

    return () => observer.disconnect();
  }, [numImagesToShow, images.length]);

  return (
    <div>
      <Select
        value={imageListFilter}
        onChange={setFilter}
        options={filterOptions}
        style={{ minWidth: 300, marginBottom: "1rem" }}
      />
      {images.slice(0, numImagesToShow).map((image, index) => (
        <ImageCard
          key={image.fileName}
          image={image}
          onChange={onUpdate(index)}
          onDelete={loadImageAsyncHandler}
        />
      ))}
      <div ref={listEndRef} style={{ height: "1px" }} />
    </div>
  );
}
