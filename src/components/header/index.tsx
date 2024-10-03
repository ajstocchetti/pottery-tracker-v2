import { Button } from "antd";
import { logout } from "src/auth";

import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";

import style from "./header.module.css";

const items: MenuProps["items"] = [
  {
    key: "pieces",
    label: <a href="/">Pieces</a>,
  },
  {
    key: "images",
    label: "Images",
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
