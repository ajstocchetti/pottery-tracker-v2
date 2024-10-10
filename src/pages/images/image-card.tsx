import { InputNumber, Switch } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import DeleteImageButton from "src/components/imageDelete";
import Image from "src/components/image";
import { Image as ImageInterface } from "src/interfaces";
import style from "./image-card.module.css";

interface Props {
  image: ImageInterface;
  onChange: (image: ImageInterface) => void;
  onDelete: () => void;
}

export default function ImageCard(props: Props) {
  const { image, onDelete, onChange } = props;
  const [showRaw, setShowRaw] = useState<boolean>(false);

  function saveHandler(update: object) {
    onChange({
      ...image,
      ...update,
    });
  }

  function toggleInspiration() {
    saveHandler({
      is_inspiration: !image.is_inspiration,
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
        <label>Is Inspiration:</label>
        <Switch value={image.is_inspiration} onChange={toggleInspiration} />
      </div>
      <div>
        <label>All Images Set:</label>
        {image.all_pieces_added ? (
          <CheckCircleOutlined />
        ) : (
          <CloseCircleOutlined />
        )}
      </div>
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
