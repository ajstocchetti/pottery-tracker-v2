import { Collapse } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Piece } from "src/interfaces";
import { savePiece } from "src/data";
import AdvanceStatus from "./advanceStatus";
import styles from "./pieceCard.module.css";
import Thumbnail from "./thumbnail";

interface Props {
  piece: Piece;
  showStatus: boolean;
  onUpdate: () => void;
}

interface StdLabeledDataProps {
  label: string;
  value: string | null;
}
const StdLabeledData = (props: StdLabeledDataProps) => (
  <div>
    <label>{props.label}: </label>
    <span>{props.value}</span>
  </div>
);

function getStatusDate(piece: Piece) {
  switch (piece.status) {
    case "NEEDS_TRIMMING":
      return <StdLabeledData label="Thrown" value={piece.date_thrown} />;
    case "DRYING_OUT":
      if (piece.is_handbuilt)
        return <StdLabeledData label="Thrown" value={piece.date_thrown} />;
      else return <StdLabeledData label="Trimmed" value={piece.date_trimmed} />;
    case "AT_BISQUE":
      return <StdLabeledData label="To Bisque" value={piece.date_to_bisque} />;
    case "AT_GLAZE":
      return <StdLabeledData label="To Glaze" value={piece.date_to_glaze} />;
    default:
      return <StdLabeledData label="Thrown" value={piece.date_thrown} />;
  }
}

export function PieceCard(props: Props) {
  const { piece, showStatus } = props;

  const statusDate = getStatusDate(piece);

  async function statusUpdateHandler(update: object | null) {
    if (!update) return;
    const resp = await savePiece({ ...piece, ...update });
    if (resp) props.onUpdate();
  }

  return (
    <div className={styles.pieceCard}>
      {showStatus ? <div>{piece.status}</div> : null}
      <div>
        <Link to={`/pieces/${piece.id}`}>
          <Thumbnail fileName={piece.images[0]} />
        </Link>
      </div>
      <AdvanceStatus status={piece.status} update={statusUpdateHandler} />
      <StdLabeledData label="Form" value={piece.form_type} />
      <StdLabeledData label="Clay" value={piece.clay_type} />
      <StdLabeledData label="Notes" value={piece.notes} />
      {statusDate}
      <Collapse
        size="small"
        items={[
          {
            key: "1",
            label: "More info",
            children: (
              <div>
                <StdLabeledData label="Thrown" value={piece.date_thrown} />
                <StdLabeledData label="Trimmed" value={piece.date_trimmed} />
                <StdLabeledData
                  label="To Bisque"
                  value={piece.date_to_bisque}
                />
                <StdLabeledData label="To Glaze" value={piece.date_to_glaze} />
                <StdLabeledData label="Weight" value={piece.weight} />
                <StdLabeledData label="Glaze" value={piece.glaze} />
                <div>
                  <label>Hand Built: </label>
                  {piece.is_handbuilt ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )}
                </div>
                <StdLabeledData label="Id" value={piece.id} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
