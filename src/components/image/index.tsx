import { useEffect, useState } from "react";
import { getImageSrc } from "src/data";

interface Props {
  fileName: string;
  style: { [css: string]: any };
}

export default function Image(props: Props) {
  const [src, setSrc] = useState(undefined);
  const { fileName, style = {} } = props;

  async function asncHandler() {
    const imgSrc = await getImageSrc(fileName);
    if (imgSrc) setSrc(imgSrc);
  }

  useEffect(() => {
    asncHandler();
  }, [fileName]);

  return <img src={src} alt={fileName} style={style} />;
}
