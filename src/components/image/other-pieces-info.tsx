import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadPiece } from "src/data";
import { Piece } from "src/interfaces";

interface Props {
  pieceIds: string[];
}

export default function OtherPiecesInfo(props: Props) {
  const { pieceIds } = props;
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    onIdsChange();
  }, [pieceIds]);

  async function onIdsChange() {
    const p = await Promise.all(pieceIds.map((p) => loadPiece(p)));
    setPieces(p.filter((a) => !!a));
  }

  return (
    <div>
      {pieces.map((piece) => (
        <div key={piece.id}>
          <Link to={`/pieces/${piece.id}`}>
            {piece.id} - {piece.status} | {piece.form_type} | {piece.notes}
          </Link>
        </div>
      ))}
    </div>
  );
}
