import { useEffect, useState } from "react";
import { getImageSrc } from "src/data";
import style from "./image.module.css";

export interface Props {
  fileName: string;
  customStyle?: { [css: string]: string };
  onClick?: () => void;
}

export default function Image(props: Props) {
  const [src, setSrc] = useState(undefined);
  const { fileName, customStyle = {}, onClick } = props;

  async function asncHandler() {
    const imgSrc = await getImageSrc(fileName);
    if (imgSrc) setSrc(imgSrc);
  }

  useEffect(() => {
    asncHandler();
  }, [fileName]);

  function clickHandler() {
    if (onClick instanceof Function) onClick();
  }

  return (
    <img
      src={src}
      alt={fileName}
      className={style.standard}
      style={customStyle}
      onClick={clickHandler}
    />
  );
}
