import { LazyOption, SelectOption } from "src/interfaces";
import { Button, Input, Popconfirm, Switch } from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

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
    return typeof inputOption === "string"
      ? inputOption
      : `${inputOption.label} [${inputOption.value}]`;
  }

  function onStringChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = e.target.value;
    setOption(nextValue);
  }

  return (
    <div className={style.container}>
      <label>
        <strong>{displayValue()}</strong>
      </label>
      {!disableComplex && (
        <Switch
          checkedChildren="Simple"
          unCheckedChildren="Complex"
          value={typeof option === "string"}
          onChange={toggleIsString}
          style={{ marginLeft: "0.5rem" }}
        />
      )}

      <div className={style.spacedRow}>
        {typeof option === "string" ? (
          <Input value={option} onChange={onStringChange} />
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

interface SelectEditorProps {
  option: SelectOption;
  onChange: (opt: SelectOption) => void;
}

function SelectOptionEditor(props: SelectEditorProps) {
  const { option: inputOption } = props;
  const [option, setOption] = useState<SelectOption>({ label: "", value: "" });

  useEffect(() => {
    setOption(inputOption);
  }, [inputOption]);

  function onChangeOptionValue(e: React.ChangeEvent<HTMLInputElement>) {
    const nextOption = { ...option, value: e.target.value };
    setOption(nextOption);
    props.onChange(nextOption);
  }

  function onChangeOptionLabel(e: React.ChangeEvent<HTMLInputElement>) {
    const nextOption = { ...option, label: e.target.value };
    setOption(nextOption);
    props.onChange(nextOption);
  }

  return (
    <div>
      <label>Display Name</label>
      <Input value={option.label} onChange={onChangeOptionLabel} />
      <label>Value</label>
      <Input value={option.value} onChange={onChangeOptionValue} />
    </div>
  );
}
