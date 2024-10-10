import { Button, Popconfirm } from "antd";
import Image from "src/components/image";
import style from "./piecedetail.module.css";

interface Props {
  images: string[];
  editing: boolean;
  onListChange: (images: string[]) => void;
}

export default function ImageList(props: Props) {
  const { images, editing, onListChange } = props;

  function removeImage(imageIndex: number) {
    return function () {
      const next = [...images];
      next.splice(imageIndex, 1);
      onListChange(next);
    };
  }

  function setPrimary(imageIndex: number) {
    return function () {
      if (imageIndex === 0) return;
      const copy = [...images];
      const [toFront] = copy.splice(imageIndex, 1);
      onListChange([toFront, ...copy]);
    };
  }

  return (
    <div>
      {images.map((fileName, index) => (
        <div key={fileName} className={style.imageListItem}>
          <Image fileName={fileName} customStyle={{ display: "block" }} />
          {editing && (
            <div>
              <Button onClick={setPrimary(index)}>Set as Primary</Button>
              <Popconfirm
                title="Remove from Piece"
                description="Remove image from the piece"
                onConfirm={removeImage(index)}
                okText="Remove"
                cancelText="Cancel"
              >
                <Button>Remove Image</Button>
              </Popconfirm>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
