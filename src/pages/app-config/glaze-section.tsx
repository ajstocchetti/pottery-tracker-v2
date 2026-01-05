import { Button, Input } from "antd";
import { LockOutlined, SaveOutlined } from "@ant-design/icons";
import { useState } from "react";

import LazyOptionEditor from "src/components/lazy-option-editor";
import {
  addGlazeItem,
  deleteGlazeItem,
  editGlazeItem,
  renameGlazeSection,
} from "src/data";
import style from "src/components/lazy-option-editor/style.module.css";

interface Props {
  sectionName: string;
  glazes: readonly string[];
}

// TODO: make this a class
const newBtnStyle = {
  width: 175,
};

export default function GlazeSection(props: Props) {
  const { sectionName, glazes } = props;
  const [nameUpdate, setNameUpdate] = useState<string>(sectionName);
  const [nameEditDisabled, setNameEditDisabled] = useState<boolean>(true);

  function onNameSave() {
    renameGlazeSection(sectionName, nameUpdate);
  }

  function toggleDisabled() {
    setNameEditDisabled(!nameEditDisabled);
  }

  return (
    <div>
      <div className={style.spacedRow}>
        <Input
          value={nameUpdate}
          disabled={nameEditDisabled}
          onChange={(e) => setNameUpdate(e.target.value)}
        />
        <Button onClick={toggleDisabled}>
          <LockOutlined />
        </Button>
        <Button type="primary" onClick={onNameSave}>
          <SaveOutlined />
        </Button>
        {/* TODO: delete section button */}
      </div>
      <hr />

      {glazes.map((glaze, idx) => (
        <LazyOptionEditor
          key={idx}
          option={glaze}
          onSave={(newValue) => {
            // @ts-expect-error - we know newValue will be a string when disableComplex is true
            editGlazeItem(sectionName, newValue, idx);
          }}
          onDelete={() => deleteGlazeItem(sectionName, idx)}
          disableComplex={true}
          optionType="glaze"
        />
      ))}
      <Button
        style={newBtnStyle}
        type="primary"
        onClick={() => addGlazeItem(sectionName)}
      >
        New Glaze
      </Button>
    </div>
  );
}
