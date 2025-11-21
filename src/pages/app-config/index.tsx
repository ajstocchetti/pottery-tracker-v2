import { Button, Collapse } from "antd";
import { useSnapshot } from "valtio";
import LazyOptionEditor from "src/components/lazy-option-editor";
import {
  addGlazeItem,
  deleteGlazeItem,
  editGlazeItem,
  addStudioItem,
  editStudioItem,
  deleteStudioItem,
  editClayBodyItem,
  deleteClayBodyItem,
  addClayBodyItem,
  addFormItem,
  editFormItem,
  deleteFormItem,
} from "src/data";
import { state } from "src/store/valio";

const newBtnStyle = {
  width: 175,
};

export default function AppConfig() {
  const { appConfig } = useSnapshot(state);

  return (
    <div>
      <h2>App Configuration Editor</h2>
      <Collapse
        items={[
          {
            key: "claybodies",
            label: "Clay Bodies",
            children: (
              <>
                {appConfig.claybody.map((clayBody, idx) => (
                  <LazyOptionEditor
                    key={idx}
                    option={clayBody}
                    onSave={(option) => {
                      editClayBodyItem(option, idx);
                    }}
                    onDelete={() => deleteClayBodyItem(idx)}
                    optionType="clay body"
                  />
                ))}
                <Button
                  style={newBtnStyle}
                  type="primary"
                  onClick={() => addClayBodyItem()}
                >
                  New Clay Body
                </Button>
              </>
            ),
          },
          {
            key: "forms",
            label: "Forms",
            children: (
              <>
                {appConfig.form.map((form, idx) => (
                  <LazyOptionEditor
                    key={idx}
                    option={form}
                    onSave={(option) => {
                      editFormItem(option, idx);
                    }}
                    onDelete={() => {
                      deleteFormItem(idx);
                    }}
                    optionType="form"
                  />
                ))}
                <Button
                  style={newBtnStyle}
                  type="primary"
                  onClick={() => {
                    addFormItem();
                  }}
                >
                  New Form
                </Button>
              </>
            ),
          },
          {
            key: "glazes",
            label: "Glazes",
            children: (
              <>
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
                    optionType="glaze"
                  />
                ))}
                <Button
                  style={newBtnStyle}
                  type="primary"
                  onClick={() => addGlazeItem()}
                >
                  New Glaze
                </Button>
              </>
            ),
          },
          {
            key: "studios",
            label: "Studios",
            children: (
              <>
                {appConfig.studio.map((studio, idx) => (
                  <LazyOptionEditor
                    key={idx}
                    option={studio}
                    onSave={(option) => {
                      editStudioItem(option, idx);
                    }}
                    onDelete={() => deleteStudioItem(idx)}
                    disableComplex={true}
                    optionType="studio"
                  />
                ))}
                <Button
                  style={newBtnStyle}
                  type="primary"
                  onClick={() => addStudioItem()}
                >
                  New Studio
                </Button>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
