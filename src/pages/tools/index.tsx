import { Button } from "antd";
import { useEffect, useState } from "react";
import {
  checkImageDirectory,
  loadAllData,
  loadImages,
  saveData,
  updateImagePieceCount,
} from "src/data";
import { Image } from "src/interfaces";

export default function Tools() {
  const [images, setImages] = useState<Image[]>([]);

  async function imgAsyncHandler() {
    const imgs = await loadImages();
    setImages(imgs);
  }

  useEffect(() => {
    imgAsyncHandler();
  }, []);

  async function checkImagesHandler() {
    await checkImageDirectory();
    imgAsyncHandler();
  }

  async function imagePieceCountHandler() {
    await updateImagePieceCount();
    await saveData();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Button onClick={loadAllData}>Load from Dropbox</Button>
      <Button onClick={saveData}>Save to Dropbox</Button>
      <Button onClick={imagePieceCountHandler}>Set Image Count Full</Button>
      <Button onClick={checkImagesHandler}>Check for images</Button>
      <div>
        <label>Number of images: </label>
        <span>{images.length}</span>
      </div>
    </div>
  );
}
