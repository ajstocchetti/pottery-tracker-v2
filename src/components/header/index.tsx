import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { logout } from "src/auth";
import style from "./header.module.css";

const items: MenuProps["items"] = [
  {
    key: "pieces",
    label: <Link to="/">Pieces</Link>,
  },
  {
    key: "images",
    label: "Images",
  },
  {
    key: "tools",
    label: <Link to="/tools">Tools</Link>,
  },
];

export default function Header() {
  return (
    <header>
      <div className={style.header}>
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Navigation
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>

        <Button variant="solid" color="primary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
