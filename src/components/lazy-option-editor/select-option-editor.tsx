import { useEffect, useState } from "react";
import { Input } from "antd";
import { SelectOption } from "src/interfaces";

interface Props {
  option: SelectOption;
  onChange: (opt: SelectOption) => void;
}

export default function SelectOptionEditor(props: Props) {
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
      <label>Value</label>
      <Input value={option.value} onChange={onChangeOptionValue} />

      <label>Display Name</label>
      <Input value={option.label} onChange={onChangeOptionLabel} />
    </div>
  );
}
