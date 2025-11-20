import { LazyOption, SelectOption } from "src/interfaces";
import { Button, Popconfirm, Switch } from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import SelectOptionEditor from "./select-option-editor";
import StringOptionEditor from "./string-editor";
import style from "./style.module.css";

interface Props {
  option: LazyOption;
  onSave: (opt: LazyOption) => void;
  onDelete?: () => void;
  disableComplex?: boolean;
  optionType?: string;
}

export default function LazyOptionEditor(props: Props) {
  const {
    option: inputOption,
    onDelete,
    onSave,
    disableComplex = false,
    optionType = "option",
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

  function displayValue() {
    return typeof inputOption === "string" ? inputOption : inputOption.label;
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

      <label>
        <strong>{displayValue()}</strong>
      </label>

      <div className={style.spacedRow}>
        {typeof option === "string" ? (
          <StringOptionEditor option={option} onChange={setOption} />
        ) : (
          <SelectOptionEditor option={option} onChange={setOption} />
        )}

        <Button type="primary" onClick={() => onSave(option)}>
          <SaveOutlined />
        </Button>
        {onDelete && (
          <Popconfirm
            title="Confirm Deletion"
            description={`Are you sure to delete the ${optionType} ${displayValue()}?`}
            onConfirm={() => onDelete()} // do not await
            // onCancel={cancel}
            okText="DELETE"
            cancelText="Cancel"
            icon={<DeleteOutlined />}
          >
            <Button type="primary" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        )}
      </div>
    </div>
  );
}
