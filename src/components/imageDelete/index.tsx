import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteImage } from "src/data";

interface Props {
  fileName: string;
  onDelete: () => void;
}
export default function DeleteImageButton(props: Props) {
  const { fileName, onDelete } = props;

  async function deleteClickHandler() {
    await deleteImage(fileName);
    onDelete();
  }

  return (
    <Popconfirm
      title="Delete Image"
      description="Confirm Delete Image!"
      onConfirm={deleteClickHandler}
      okText="DELETE"
      cancelText="Cancel"
      icon={<DeleteOutlined />}
    >
      <Button color="danger" variant="filled">
        Delete Image
      </Button>
    </Popconfirm>
  );
}
