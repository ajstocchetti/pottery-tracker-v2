import { useEffect, useState } from "react";
import { Select } from "antd";
import { useSnapshot } from "valtio";
import { loadPieces } from "src/data";
import { Piece } from "src/interfaces";
import { state } from "src/store/valio";
import { PieceCard } from "./pieceCard";

const statusTypes: string[] = [
  "NEEDS_TRIMMING",
  "DRYING_OUT",
  "AT_BISQUE",
  "NEEDS_GLAZE",
  "AT_GLAZE",
  "COMPLETE",
  "ABANDONED",
  "ALL",
];
const sortOptions: string[] = [
  "notes",
  "date_thrown",
  "date_trimmed",
  "date_to_bisque",
  "date_to_glaze",
  "created_at",
  "updated_at",
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
      <Select
        value={pieceListStatus}
        onChange={setStatus}
        style={{ minWidth: 180 }}
      >
        {statusTypes.map((status) => (
          <Select.Option value={status} key={status}>
            {status}
          </Select.Option>
        ))}
      </Select>
      <Select
        value={pieceListSort}
        onChange={setSort}
        style={{ minWidth: 180 }}
      >
        {sortOptions.map((sorter) => (
          <Select.Option value={sorter} key={sorter}>
            {sorter}
          </Select.Option>
        ))}
      </Select>
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
