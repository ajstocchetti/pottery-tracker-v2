import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { snapshot } from "valtio";
import { logout } from "src/auth";
import { state } from "src/store/valio";
import style from "./header.module.css";

const items: MenuProps["items"] = [
  {
    key: "pieces",
    label: <Link to="/">Pieces</Link>,
  },
  {
    key: "images",
    label: <Link to="/images">Images</Link>,
  },
  {
    key: "tools",
    label: <Link to="/tools">Tools</Link>,
  },
];

export default function Header() {
  const { user } = snapshot(state);
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

        <span>{user.email}</span>

        <Button variant="solid" color="primary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
