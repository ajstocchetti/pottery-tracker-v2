import MultiPieceImage from "src/components/image/multi-piece-image";

interface Props {
  fileName: string;
}

export default function Thumbnail(props: Props) {
  const { fileName } = props;
  if (!fileName) return <p>No image(s) set</p>;
  return <MultiPieceImage imageProps={{ fileName: fileName }} />;
}
