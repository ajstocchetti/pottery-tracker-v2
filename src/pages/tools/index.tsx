import { Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkImageDirectory,
  loadAllData,
  loadImages,
  logData,
  saveData,
  updateImagePieceCount,
} from "src/data";
import { Image } from "src/interfaces";

export default function Tools() {
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);

  async function imgAsyncHandler() {
    const imgs = await loadImages("ALL");
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

  function goToConfigEditor() {
    navigate("/app-config");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Button onClick={loadAllData}>Load from Dropbox</Button>
      <Button onClick={saveData}>Save to Dropbox</Button>
      <Button onClick={logData}>Log Data</Button>
      <Button onClick={imagePieceCountHandler}>Set Image Count Full</Button>
      <Button onClick={checkImagesHandler}>Check for images</Button>
      <Button onClick={goToConfigEditor}>Config Editor</Button>
      <div>
        <label>Number of images: </label>
        <span>{images.length}</span>
      </div>
    </div>
  );
}
