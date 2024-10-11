import { Button, Collapse, Popconfirm } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Piece } from "src/interfaces";
import { savePiece } from "src/data";
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

  async function markBackFromKiln() {
    if (!["AT_BISQUE", "AT_GLAZE"].includes(piece.status)) {
      return;
    }
    const updateKey =
      piece.status === "AT_BISQUE"
        ? "returned_from_bisque"
        : "returned_from_glaze";
    const resp = await savePiece({ ...piece, [updateKey]: true });
    if (resp) props.onUpdate();
  }

  let backFromKilnButton = null;
  if (piece.status === "AT_BISQUE" || piece.status === "AT_GLAZE") {
    const kilnType: string = piece.status === "AT_BISQUE" ? "Bisque" : "Glaze";
    backFromKilnButton = (
      <Popconfirm
        title="Back From Kiln"
        description={`Confirm that piece is back from ${kilnType}`}
        onConfirm={markBackFromKiln}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Button>Back from {kilnType}</Button>
      </Popconfirm>
    );
  }

  return (
    <div className={styles.pieceCard}>
      {showStatus ? <div>{piece.status}</div> : null}
      <div>
        <Link to={`/pieces/${piece.id}`}>
          <Thumbnail fileName={piece.images[0]} />
        </Link>
      </div>
      {backFromKilnButton}
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
                <div>
                  <label>Abandoned: </label>
                  {piece.is_abandoned ? (
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
