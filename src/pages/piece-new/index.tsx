import { Spin } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { savePiece } from "src/data";

export default function NewPiece() {
  const navigate = useNavigate();

  useEffect(() => {
    createPieceHandler();
  }, []);

  async function createPieceHandler() {
    const piece = await savePiece(
      {
        id: "",
        created_at: new Date(),
        updated_at: new Date(),
        date_thrown: dayjs().format("YYYY-MM-DD"),
        date_trimmed: null,
        date_to_bisque: null,
        date_to_glaze: null,
        returned_from_bisque: false,
        returned_from_glaze: false,
        is_abandoned: false,
        form_type: "OTHER",
        clay_type: "OTHER",
        is_handbuilt: false,
        notes: "",
        glaze: "",
        fate: "",
        status: "NEEDS_TRIMMING",
        weight: "",
        images: [],
        studio: "",
      },
      true
    );
    if (piece) navigate(`/pieces/${piece.id}`);
  }

  return (
    <div>
      <h1>Setting up...</h1>
      <Spin />
    </div>
  );
}
