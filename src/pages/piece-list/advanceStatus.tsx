import { Button, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface Props {
  status: string;
  update: (update: object | null) => void;
}

export default function AdvanceStatus(props: Props) {
  const { status, update } = props;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [changeObj, setChange] = useState<object | null>(null);

  useEffect(() => {
    switch (status) {
      case "NEEDS_TRIMMING":
        setTitle("Mark as Trimmed");
        setDescription("Confirm that piece was trimmed today");
        setChange({ date_trimmed: dayjs().format("YYYY-MM-DD") });
        break;
      case "DRYING_OUT":
        setTitle("Mark at Bisque");
        setDescription("Confirm that piece is at Bisque");
        setChange({ date_to_bisque: dayjs().format("YYYY-MM-DD") });
        break;
      case "AT_BISQUE":
        setTitle("Back from Bisque");
        setDescription("Confirm that piece is back from Bisque");
        setChange({ returned_from_bisque: true });
        break;
      case "AT_GLAZE":
        setTitle("Back from Glaze");
        setDescription("Confirm that piece is back from Glaze");
        setChange({ returned_from_glaze: true });
        break;
      default:
        setTitle("");
        setDescription("");
        setChange(null);
    }
  }, [status]);

  if (!changeObj) return null;

  function onConfirm() {
    update(changeObj);
  }

  return (
    <Popconfirm
      title={title}
      description={description}
      onConfirm={onConfirm}
      okText="Confirm"
      cancelText="Cancel"
    >
      <Button>{title}</Button>
    </Popconfirm>
  );
}
