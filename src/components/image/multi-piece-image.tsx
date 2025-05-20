import { Popover } from "antd";
import { useEffect, useState } from "react";
import { getPiecesForImage } from "src/data";
import Image, { Props as ImageProps } from ".";
import OtherPiecesInfo from "./other-pieces-info";

interface Props {
  minPiecesToShow?: number;
  imageProps: ImageProps;
}

export default function MultiPieceImage(props: Props) {
  const { imageProps, minPiecesToShow = 2 } = props;
  const { fileName } = imageProps;
  // const { imageProps: { fileName } } = props;
  const [pieceIds, setPieceIds] = useState<string[]>([]);

  useEffect(() => {
    setPieceIds(getPiecesForImage(fileName));
  }, [fileName]);

  if (pieceIds.length < minPiecesToShow) {
    return <Image {...imageProps} />;
  }
  return (
    <Popover
      mouseEnterDelay={1.4}
      placement="left"
      content={<OtherPiecesInfo pieceIds={pieceIds} />}
    >
      {/* need to wrap image in div for popover to work */}
      <div>
        <Image {...imageProps} />
      </div>
    </Popover>
  );
}
