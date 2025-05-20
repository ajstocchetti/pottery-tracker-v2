import { Button, Popover } from "antd";
import { useEffect, useState } from "react";
import { getPiecesForImage } from "src/data";
import OtherPiecesInfo from "./other-pieces-info";

interface Props {
  fileName: string;
  excludePiece?: string;
  buttonText?: string;
}

export default function OtherPieces(props: Props) {
  const { buttonText = "Other Pieces", excludePiece, fileName } = props;
  const [pieceIds, setPieceIds] = useState<string[]>([]);

  useEffect(() => {
    let ids = fileName ? getPiecesForImage(fileName) : [];
    if (excludePiece) ids = ids.filter((id) => id != excludePiece);
    setPieceIds(ids);
  }, [fileName]);

  if (pieceIds.length < 1) {
    return;
  }

  return (
    <Popover trigger="click" content={<OtherPiecesInfo pieceIds={pieceIds} />}>
      <Button>{buttonText}</Button>
    </Popover>
  );
}
