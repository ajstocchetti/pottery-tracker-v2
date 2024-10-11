import { useState } from "react";
import { Button, Spin } from "antd";
import { uploadImage } from "src/data";

interface Props {
  pieceId: string;
  onUpload: () => void;
}

export function fileToUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target.result);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
}

// TODO: setup drag and drop https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#selecting_files_using_drag_and_drop
export default function AddImageButton(props: Props) {
  const { pieceId, onUpload } = props;
  const [img, setImg] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  async function onFileChange(e) {
    if (e.target.files && e.target.files.length) {
      setImg(e.target.files[0]);
      const url = await fileToUrl(e.target.files[0]);
      setImgUrl(url);
    } else {
      setImg(null);
      setImgUrl("");
    }
  }

  async function onSubmit(e) {
    e.stopPropagation();
    e.preventDefault();
    setSaving(true);
    await uploadImage(img, pieceId);
    setSaving(false);
    setImg(null);
    setImgUrl("");
    onUpload();
  }

  return (
    <div>
      <div>
        <div>
          {saving ? (
            <Spin />
          ) : (
            <>
              <p>Add Image</p>
              <input type="file" onChange={onFileChange} accept="image/*" />
            </>
          )}
        </div>

        <div>
          {imgUrl ? (
            <img
              src={imgUrl}
              style={{ maxWidth: 300 }}
              alt="thumbnail of uploaded file"
            />
          ) : null}
        </div>

        {img && (
          <div>
            <Button onClick={onSubmit}>Add Image</Button>
          </div>
        )}
      </div>
    </div>
  );
}
