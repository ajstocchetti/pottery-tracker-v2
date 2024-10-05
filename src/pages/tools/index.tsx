import { Button } from "antd";
import { useEffect, useState } from "react";
import { checkImageDirectory, loadImages } from "src/data";
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

  return (
    <div>
      {/* <Button>Load from Dropbox</Button> */}
      {/* <Button>Save to Dropbox</Button> */}
      <Button onClick={checkImagesHandler}>Check for images</Button>
      <div>
        <label>Number of images: </label>
        <span>{images.length}</span>
      </div>
    </div>
  );
}
