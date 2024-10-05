import Image from "src/components/image";

interface Props {
  fileName: string;
}

export default function Thumbnail(props: Props) {
  const { fileName } = props;
  if (!fileName) return <p>No image(s) set</p>;
  return (
    <Image
      fileName={fileName}
      style={{ maxHeight: 300, maxWidth: "-webkit-fill-available" }}
    />
  );
}
