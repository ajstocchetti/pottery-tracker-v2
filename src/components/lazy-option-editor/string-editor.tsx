import { Input } from "antd";
import { useEffect, useState } from "react";

interface Props {
  option: string;
  onChange: (opt: string) => void;
}

export default function StringOptionEditor(props: Props) {
  const { option: inputOption, onChange } = props;
  const [option, setOption] = useState<string>("");

  useEffect(() => {
    setOption(inputOption);
  }, [inputOption]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = e.target.value;
    setOption(nextValue);
    onChange(nextValue);
  }

  return <Input value={option} onChange={handleChange} />;
}
