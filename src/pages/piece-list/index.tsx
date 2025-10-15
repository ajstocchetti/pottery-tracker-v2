import _ from "lodash";
import { Button, Input, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  { label: "In Progress", value: "_IN_PROGRESS" },
  { label: "Complete", value: "COMPLETE" },
  { label: "Abandoned", value: "ABANDONED" },
  { label: "All Pieces", value: "_ALL" },
];

const sortOptions: SelectOptions = [
  { label: "Thrown", value: "-date_thrown" },
  { label: "Thrown (earliest)", value: "date_thrown" },
  { label: "Trimmed", value: "-date_trimmed" },
  { label: "Trimmed (earliest)", value: "date_trimmed" },
  { label: "To Bisque", value: "-date_to_bisque" },
  { label: "To Bisque (earliest)", value: "date_to_bisque" },
  { label: "To Glaze", value: "-date_to_glaze" },
  { label: "To Glaze (earliest)", value: "date_to_glaze" },
  { label: "Created", value: "-created_at" },
  { label: "Created (earliest)", value: "created_at" },
  { label: "Updated", value: "-updated_at" },
  { label: "Updated (earliest)", value: "updated_at" },
  { label: "Notes", value: "notes" },
];

export default function PieceList({}) {
  const [allPieces, setAllPieces] = useState<Piece[]>([]);
  const [numPiecesToShow, setNumPiecesToShow] = useState<number>(10);
  const [textFilter, setTextFilter] = useState<string>("");
  const { pieceListSort, pieceListStatus } = useSnapshot(state);
  const [searchParams, setSearchParams] = useSearchParams();
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sortValue = searchParams.get("pieceListSort");
    if (sortValue) {
      if (!_.find(sortOptions, { value: sortValue })) {
        console.log(`Invalid sort query parameter: ${sortValue}`);
      } else {
        setStatus(sortValue);
      }
    }

    const statusValue = searchParams.get("pieceListStatus");
    if (statusValue) {
      if (!_.find(statusTypes, { value: statusValue })) {
        console.log(`Invalid status query parameter: ${statusValue}`);
      } else {
        setStatus(statusValue);
      }
    }
  }, []);

  useEffect(() => {
    setSearchParams({
      pieceListStatus,
      pieceListSort,
    });
    loadPiecesHandler();
  }, [pieceListStatus, pieceListSort, textFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && numPiecesToShow < allPieces.length) {
          setNumPiecesToShow((prev) => prev + 5);
        }
      },
      { threshold: 0.1 }
    );

    if (listEndRef.current) {
      observer.observe(listEndRef.current);
    }

    return () => observer.disconnect();
  }, [numPiecesToShow, allPieces.length]);

  function setSort(sortValue: string) {
    state.pieceListSort = sortValue;
  }

  function setStatus(status: string) {
    state.pieceListStatus = status;
    switch (status) {
      case "NEEDS_TRIMMING":
        setSort("date_thrown");
        break;
      case "DRYING_OUT":
        setSort("date_trimmed");
        break;
      case "AT_BISQUE":
        setSort("date_to_bisque");
        break;
      case "AT_GLAZE":
        setSort("date_to_glaze");
        break;
      default:
        setSort("-updated_at");
    }
  }

  async function loadPiecesHandler() {
    const loadedPieces = await loadPieces(
      pieceListSort,
      pieceListStatus,
      textFilter
    );
    if (loadedPieces) setAllPieces(loadedPieces);
  }

  function textFilterHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setTextFilter(e.target.value);
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
        <Input
          placeholder="Filter"
          value={textFilter}
          allowClear
          onChange={textFilterHandler}
        />
        <span>{allPieces.length} pieces</span>
      </div>
      {allPieces.slice(0, numPiecesToShow).map((piece) => (
        <PieceCard
          piece={piece}
          key={piece.id}
          showStatus={pieceListStatus.startsWith("_")}
          onUpdate={loadPiecesHandler}
        />
      ))}
      {!allPieces.length && <div>No pieces</div>}
      <div ref={listEndRef} style={{ height: "1px" }} />
    </>
  );
}
