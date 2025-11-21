import { InputNumber, Switch } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import DeleteImageButton from "src/components/image-delete-button";
import { getPiecesForImage } from "src/data";
import Image from "src/components/image";
import { Image as ImageInterface } from "src/interfaces";
import style from "./image-card.module.css";
import { Link } from "react-router-dom";

interface Props {
  image: ImageInterface;
  onChange: (image: ImageInterface) => void;
  onDelete: () => void;
}

export default function ImageCard(props: Props) {
  const { image, onDelete, onChange } = props;
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [pieces, setPieces] = useState<string[]>([]);

  useEffect(() => {
    setPieces(getPiecesForImage(image.fileName));
  }, [image.fileName]);

  function saveHandler(update: object) {
    onChange({
      ...image,
      ...update,
    });
  }

  function numPiecesChanged(numPieces: number | null) {
    if (!numPieces) return;
    return saveHandler({ number_pieces: numPieces });
  }

  return (
    <div className={style.cardWrapper}>
      <Image fileName={image.fileName} />
      <h4>{image.fileName}</h4>
      <div>
        <label>Pieces in Image:</label>
        <InputNumber
          value={image.number_pieces}
          min={0}
          onChange={numPiecesChanged}
        />
      </div>
      <div>
        <label>All Images Set:</label>
        {image.all_pieces_added ? (
          <CheckCircleOutlined />
        ) : (
          <CloseCircleOutlined />
        )}
      </div>

      {pieces.length ? (
        <div>
          <span>Pieces:</span>
          <ul>
            {pieces.map((pieceId) => (
              <li key={pieceId}>
                <Link to={`/pieces/${pieceId}`}>{pieceId}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>Created at: {image.created_at}</div>
      <DeleteImageButton fileName={image.fileName} onDelete={onDelete} />
      <div>
        <label>Show Raw:</label>
        <Switch value={showRaw} onChange={() => setShowRaw(!showRaw)} />
      </div>

      {showRaw && <pre>{JSON.stringify(image, null, 2)}</pre>}
    </div>
  );
}
