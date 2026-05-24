import { useSnapshot } from "valtio";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { state } from "src/store/valio";
import "./footer.css";

export default function Footer() {
  const { dbxInprocessSaves } = useSnapshot(state);

  if (dbxInprocessSaves)
    return (
      <div className="footer">
        Saving... [{dbxInprocessSaves}]
        <Spin indicator={<LoadingOutlined spin />} />
      </div>
    );
  return null;
}
