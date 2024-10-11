import { Button, Select } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSnapshot } from "valtio";
import { loadPieces } from "src/data";
import { Piece, SelectOptions } from "src/interfaces";
import { state } from "src/store/valio";
import { PieceCard } from "./pieceCard";
import style from "./piecelist.module.css";

const statusTypes: SelectOptions = [
  { label: "Needs Trimming", value: "NEEDS_TRIMMING" },
  { label: "Drying Out", value: "DRYING_OUT" },
  { label: "At Bisque", value: "AT_BISQUE" },
  { label: "Needs Glaze", value: "NEEDS_GLAZE" },
  { label: "At Glaze", value: "AT_GLAZE" },
  { label: "Complete", value: "COMPLETE" },
  { label: "Abandoned", value: "ABANDONED" },
  { label: "All Pieces", value: "ALL" },
];

const sortOptions: SelectOptions = [
  { label: "Thrown", value: "date_thrown" },
  { label: "Trimmed", value: "date_trimmed" },
  { label: "To Bisque", value: "date_to_bisque" },
  { label: "To Glaze", value: "date_to_glaze" },
  { label: "Created", value: "created_at" },
  { label: "Updated", value: "updated_at" },
  { label: "Notes", value: "notes" },
];

export function PieceList({}) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const { pieceListSort, pieceListStatus } = useSnapshot(state);

  useEffect(() => {
    loadPiecesHandler();
  }, [pieceListStatus, pieceListSort]);

  function setSort(sortValue: string) {
    state.pieceListSort = sortValue;
  }

  function setStatus(status: string) {
    state.pieceListStatus = status;
    switch (status) {
      case "NEEDS_TRIMMING":
        setSort("date_thrown");
        break;
      case "DRTING_OUT":
        setSort("date_trimmed");
        break;
      case "AT_BISQUE":
        setSort("date_to_bisque");
        break;
      case "AT_GLAZE":
        setSort("date_to_glaze");
        break;
      default:
        setSort("updated_at");
    }
  }

  async function loadPiecesHandler() {
    const pieces = await loadPieces(pieceListSort, pieceListStatus);
    if (pieces) setPieces(pieces);
  }

  return (
    <>
      <div className={style.pieceListOptions}>
        <div>
          {/* the div is for styling */}
          <Link to="/newpiece">
            <Button type="primary" block>
              New Piece
            </Button>
          </Link>
        </div>
        <Select
          value={pieceListStatus}
          onChange={setStatus}
          options={statusTypes}
        />
        <Select
          value={pieceListSort}
          onChange={setSort}
          options={sortOptions}
        />
      </div>
      {pieces.map((piece) => (
        <PieceCard
          piece={piece}
          key={piece.id}
          showStatus={pieceListStatus === "ALL"}
          onUpdate={loadPiecesHandler}
        />
      ))}
      {!pieces.length && <div>No pieces</div>}
    </>
  );
}
