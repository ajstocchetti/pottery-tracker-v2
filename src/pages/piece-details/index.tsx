import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Popconfirm,
  Radio,
  Switch,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";

import AddImageButton from "src/components/image-add-button";
import Image from "src/components/image";
import { Image as ImageInterface, Piece } from "src/interfaces";
import { deletePiece, loadImages, loadPiece, savePiece } from "src/data";

import ImageList from "./image-list";
import style from "./piecedetail.module.css";

interface GlazeDetails {
  name: string;
  number: number;
}

const FORM_OPTIONS: { label: string; value: string }[] = [
  { label: "Bowl", value: "BOWL" },
  { label: "Mug", value: "MUG" },
  { label: "Vase", value: "VASE" },
  { label: "Teapot", value: "TEAPOT" },
  { label: "Other", value: "OTHER" },
];
const CLAY_OPTIONS: { label: string; value: string }[] = [
  { label: "Porcelin", value: "PORCELIN" },
  { label: "B-Clay", value: "B_CLAY" },
  { label: "306 Brown Stoneware", value: "306" },
  { label: "White Stoneware", value: "WHITE_STONEWARE" },
  { label: "Reclaim", value: "RECLAIM" },
  { label: "Gumbo", value: "GUMBO" },
  { label: "Other", value: "OTHER" },
];

const GLAZES: GlazeDetails[] = [
  { number: 1, name: "Shaner Clear" },
  { number: 2, name: "Shaner White" },
  { number: 3, name: "Antique White" },
  { number: 4, name: "Matte White" },
  { number: 5, name: "Yellow Salt" },
  { number: 6, name: "Gustin Shino" },
  { number: 7, name: "Lau Shino" },
  { number: 8, name: "Blue Celedon" },
  { number: 9, name: "Green Celedon" },
  { number: 10, name: "Coleman Apple Green" },
  { number: 11, name: "Josh Green" },
  { number: 12, name: "Reitz Green" },
  { number: 13, name: "Josh Blue" },
  { number: 14, name: "Aviva Blue" },
  { number: 15, name: "Lavender" },
  { number: 16, name: "Rutile Blue" },
  { number: 17, name: "Iron Red" },
  { number: 18, name: "Temmoku" },
  { number: 19, name: "Matte Black" },
  { number: 20, name: "Chun Blue" },
  { number: 21, name: "Cohen's Red" },
  { number: 22, name: "Amber Celedon" },
  { number: 23, name: "Tom's Purple" },
  { number: 24, name: "Tea Dust" },
  { number: 25, name: "Galaxy Black" },
];

function glazeToString(glaze: GlazeDetails): string {
  return `${glaze.name} [${glaze.number}]`;
}

function getFormatDate(dateValue: string | null) {
  const dateFormat = "YYYY-MM-DD";
  return dateValue ? dayjs(dateValue, dateFormat) : null;
}

export default function PieceDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const [piece, setPiece] = useState<Piece>();
  const [loadErr, setLoadErr] = useState<null | string>(null);
  const [availableImages, setAvailableImages] = useState<ImageInterface[]>([]);
  const [editingImages, setEditingImages] = useState<boolean>(false);
  const [showRaw, setShowRaw] = useState<boolean>(false);

  useEffect(() => {
    loadPieceHandler();
  }, [params?.pieceId]);

  useEffect(() => {
    availableImageHandler();
  }, [piece?.images]);

  async function loadPieceHandler() {
    try {
      const pieceId = params?.pieceId;
      if (pieceId) {
        const piece = await loadPiece(pieceId);
        if (piece) setPiece(piece);
      } else throw new Error("No id in url");
    } catch (err: any) {
      setLoadErr(err);
    }
  }

  async function onImageAdded() {
    loadPieceHandler();
    availableImageHandler();
  }

  async function deleteClickHandler() {
    if (!piece) return;
    await deletePiece(piece.id);
    navigate("/");
  }

  async function savePieceHandler(piece: Piece) {
    const updated = await savePiece(piece);
    if (updated) setPiece(updated);
  }

  const debounceSave = useMemo(() => _.debounce(savePieceHandler, 1000), []);

  function setPieceValue(key: string) {
    return function (value: any) {
      if (!piece) return;
      const nextPiece: Piece = { ...piece, [key]: value };
      setPiece(nextPiece);
      debounceSave(nextPiece);
    };
  }

  function setPieceEvtTarget(key: string) {
    return function (e: any) {
      // e: React.ChangeEventHandler<HTMLInputElement> | React.ChangeEventHandler<HTMLTextAreaElement>
      setPieceValue(key)(e.target.value);
    };
  }

  function setPieceChecked(key: string) {
    return function (e: any) {
      setPieceValue(key)(e.target.checked);
    };
  }

  function setDate(key: string) {
    return function (date: any, dateString: string | string[]) {
      const value = date ? dateString : null;
      setPieceValue(key)(value);
    };
  }

  function toggleKey(key: keyof Piece) {
    return function () {
      if (!piece) return;
      setPieceValue(key)(!piece[key]);
    };
  }

  function glazeBtnClick(glaze: GlazeDetails) {
    return function () {
      let description = piece?.glaze;
      if (description && description[description.length - 1] !== " ") {
        description += " ";
      }
      description += `${glaze.name} (#${glaze.number})`;
      setPieceValue("glaze")(description);
    };
  }

  async function availableImageHandler() {
    const images = await loadImages("NEED_PIECES");
    const x = images.filter((img) => !piece?.images.includes(img.fileName));
    setAvailableImages(x);
  }

  async function setPieceImages(images: string[]) {
    setPieceValue("images")(images);
  }

  function addImage(fileName: string) {
    if (!piece) return;
    return function () {
      setPieceImages([...piece.images, fileName]);
    };
  }

  if (!piece) {
    if (!loadErr) return <p>Loading...</p>;
    else
      return (
        <div>
          Error loading piece:
          <p>{loadErr}</p>
        </div>
      );
  }

  return (
    <div>
      <div className={style.formItem}>
        <label>Id:</label>
        {piece.id}
      </div>

      <div className={style.formItem}>
        <label>Status:</label>
        {piece.status}
      </div>

      <div className={style.formItem}>
        <label>Notes</label>
        <Input.TextArea
          rows={3}
          value={piece.notes}
          onChange={setPieceEvtTarget("notes")}
        />
      </div>

      <div className={style.formItem}>
        <label>Date Thrown:</label>
        <DatePicker
          defaultValue={getFormatDate(piece.date_thrown)}
          onChange={setDate("date_thrown")}
        />
      </div>

      <div className={style.formItem}>
        <label>Is hand built:</label>
        <Switch
          value={piece.is_handbuilt}
          onChange={setPieceValue("is_handbuilt")}
        />
      </div>

      <div className={style.formItem}>
        <label>Form:</label>
        <Radio.Group
          value={piece.form_type}
          onChange={setPieceEvtTarget("form_type")}
          options={FORM_OPTIONS}
          optionType="button"
          buttonStyle="solid"
        />
      </div>

      <div className={style.formItem}>
        <label>Clay:</label>
        <Radio.Group
          value={piece.clay_type}
          onChange={setPieceEvtTarget("clay_type")}
          options={CLAY_OPTIONS}
          optionType="button"
          buttonStyle="solid"
        />
      </div>

      <div className={style.formItem}>
        <label>Weight:</label>
        <Input
          value={piece.weight}
          onChange={setPieceEvtTarget("weight")}
          style={{ width: "auto" }}
        />
      </div>

      <div className={style.formItem}>
        <label>Date Trimmed:</label>
        <DatePicker
          defaultValue={getFormatDate(piece.date_trimmed)}
          onChange={setDate("date_trimmed")}
        />
      </div>

      <div className={style.formItem}>
        <label>To Bisque:</label>
        <DatePicker
          defaultValue={getFormatDate(piece.date_to_bisque)}
          onChange={setDate("date_to_bisque")}
        />
      </div>

      <div className={style.formItem}>
        <label onClick={toggleKey("returned_from_bisque")}>
          Back from bisque:
        </label>
        <Checkbox
          checked={piece.returned_from_bisque}
          onChange={setPieceChecked("returned_from_bisque")}
        />
      </div>

      <div className={style.formItem}>
        <label>Glaze:</label>
        <Input.TextArea
          rows={3}
          value={piece.glaze}
          onChange={setPieceEvtTarget("glaze")}
        />
        {GLAZES.map((glaze: GlazeDetails, i) => (
          <Button
            key={i}
            onClick={glazeBtnClick(glaze)}
            style={{ margin: "0.5rem 0.5rem 0 0" }}
          >
            {glazeToString(glaze)}
          </Button>
        ))}
      </div>

      <div className={style.formItem}>
        <label>To Glaze:</label>
        <DatePicker
          defaultValue={getFormatDate(piece.date_to_glaze)}
          onChange={setDate("date_to_glaze")}
        />
      </div>

      <div className={style.formItem}>
        <label onClick={toggleKey("returned_from_glaze")}>
          Back from glaze:
        </label>
        <Checkbox
          checked={piece.returned_from_glaze}
          onChange={setPieceChecked("returned_from_glaze")}
        />
      </div>

      <div className={style.formItem}>
        <h3>Images</h3>
        <ImageList
          images={piece.images}
          onListChange={setPieceImages}
          editing={editingImages}
          refresh={onImageAdded}
        />
        <AddImageButton pieceId={piece.id} onUpload={onImageAdded} />
        <Button onClick={() => setEditingImages(!editingImages)}>
          {editingImages ? "Close Image Selector" : "Select Images"}
        </Button>
        {editingImages && (
          <div>
            <h3>Available Images</h3>
            {availableImages.map((img) => (
              <div key={img.fileName} onClick={addImage(img.fileName)}>
                <Image fileName={img.fileName} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={style.formItem}>
        <label onClick={toggleKey("is_abandoned")}>Ruined/Abandonded:</label>
        <Switch
          value={piece.is_abandoned}
          onChange={setPieceValue("is_abandoned")}
        />
      </div>

      <div className={style.formItem}>
        <label>Eventually Used As:</label>
        <Input value={piece.fate} onChange={setPieceEvtTarget("fate")} />
      </div>

      <hr />
      <Popconfirm
        title="Delete Piece"
        description="Are you sure you want to delete this piece?"
        onConfirm={deleteClickHandler}
        okText="DELETE"
        cancelText="Cancel"
        icon={<DeleteOutlined />}
      >
        <Button color="danger" variant="filled">
          Delete Piece
        </Button>
      </Popconfirm>

      <hr />
      <div className={style.formItem}>
        <label>Show raw:</label>
        <Switch value={showRaw} onChange={() => setShowRaw(!showRaw)} />
      </div>
      <div
        style={{
          overflowX: "scroll",
          width: "calc(100vw - 4rem)",
          display: showRaw ? "block" : "none",
        }}
      >
        <pre>{JSON.stringify(piece, null, 2)}</pre>
      </div>
    </div>
  );
}
