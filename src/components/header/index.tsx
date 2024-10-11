import { Button, Dropdown, Menu, Space } from "antd";
import type { MenuProps } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { snapshot } from "valtio";
import { logout } from "src/auth";
import useWindowDimensions from "src/components/use-window-dimensions";
import { state } from "src/store/valio";
import style from "./header.module.css";

const items: MenuProps["items"] = [
  {
    key: "pieces",
    label: <Link to="/">Pieces</Link>,
  },
  {
    key: "newpiece",
    label: <Link to="/newpiece">Add Piece</Link>,
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
  const { width } = useWindowDimensions();

  const links =
    width < 600 ? (
      <Dropdown menu={{ items }}>
        <Button>
          <Space>
            Nav
            <MenuOutlined />
          </Space>
        </Button>
      </Dropdown>
    ) : (
      <Menu mode="horizontal" items={items} />
    );

  return (
    <header>
      <div className={style.header}>
        {links}

        <span>{user?.email}</span>

        <Button variant="solid" color="primary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
