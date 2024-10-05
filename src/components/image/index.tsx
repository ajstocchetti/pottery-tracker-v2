import { useEffect, useState } from "react";
import { getImageSrc } from "src/data";
import style from "./image.module.css";

interface Props {
  fileName: string;
  customStyle?: { [css: string]: any };
}

export default function Image(props: Props) {
  const [src, setSrc] = useState(undefined);
  const { fileName, customStyle = {} } = props;

  async function asncHandler() {
    const imgSrc = await getImageSrc(fileName);
    if (imgSrc) setSrc(imgSrc);
  }

  useEffect(() => {
    asncHandler();
  }, [fileName]);

  return (
    <img
      src={src}
      alt={fileName}
      className={style.standard}
      style={customStyle}
    />
  );
}
