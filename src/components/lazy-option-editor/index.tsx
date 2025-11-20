import { LazyOption, SelectOption } from "src/interfaces";
import { Button, Popconfirm, Switch } from "antd";
import { useEffect, useState } from "react";

import SelectOptionEditor from "./select-option-editor";
import StringOptionEditor from "./string-editor";
import style from "./style.module.css";

interface Props {
  option: LazyOption;
  onSave: (opt: LazyOption) => void;
  onDelete?: () => void;
  disableComplex?: boolean;
}

export default function LazyOptionEditor(props: Props) {
  const {
    option: inputOption,
    onDelete,
    onSave,
    disableComplex = false,
  } = props;
  const [option, setOption] = useState<LazyOption>("");

  useEffect(() => {
    setOption(inputOption);
  }, [inputOption]);

  function toggleIsString() {
    if (typeof option === "string") {
      const nextOption: SelectOption = {
        label: option,
        value: option,
      };
      setOption(nextOption);
    } else {
      setOption(option.value);
    }
  }

  return (
    <div className={style.container}>
      {!disableComplex && (
        <div>
          <label>Simple Option</label>
          <Switch
            value={typeof option === "string"}
            onChange={toggleIsString}
          />
        </div>
      )}

      {typeof option === "string" ? (
        <StringOptionEditor option={option} onChange={setOption} />
      ) : (
        <SelectOptionEditor option={option} onChange={setOption} />
      )}

      <Button type="primary" onClick={() => onSave(option)}>
        Save
      </Button>
      {onDelete && (
        <Popconfirm
          title="Confirm Deletion"
          description="Are you sure to delete this option?"
          onConfirm={() => onDelete()} // do not await
          // onCancel={cancel}
          okText="Delete"
          cancelText="Cancel"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      )}
    </div>
  );
}
