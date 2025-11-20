import { useSnapshot } from "valtio";
import { state } from "src/store/valio";

import {
  addGlazeItem,
  deleteGlazeItem,
  editGlazeItem,
  addStudioItem,
  editStudioItem,
  deleteStudioItem,
} from "src/data";

import LazyOptionEditor from "src/components/lazy-option-editor";
import { Button } from "antd";

export default function AppConfig() {
  const { appConfig } = useSnapshot(state);

  return (
    <>
      <h2>App Configuration Editor</h2>
      <h3>Studios</h3>
      {appConfig.studio.map((studio, idx) => (
        <LazyOptionEditor
          key={idx}
          option={studio}
          onSave={(option) => {
            editStudioItem(option, idx);
          }}
          onDelete={() => deleteStudioItem(idx)}
        />
      ))}
      <Button onClick={() => addStudioItem()}>New Studio</Button>

      <h3>Glazes</h3>
      {appConfig.glazes.map((glaze, idx) => (
        <LazyOptionEditor
          key={idx}
          option={glaze}
          onSave={(newValue) => {
            // @ts-expect-error - we know newValue will be a string when disableComplex is true
            editGlazeItem(newValue, idx);
          }}
          onDelete={() => deleteGlazeItem(idx)}
          disableComplex={true}
        />
      ))}
      <Button onClick={() => addGlazeItem()}>New Glaze</Button>
    </>
  );
}
