import { Button, Collapse } from "antd";
import { useSnapshot } from "valtio";
import LazyOptionEditor from "src/components/lazy-option-editor";
import {
  addGlazeSection,
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
import GlazeSection from "./glaze-section";

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
                <Collapse
                  items={Object.entries(appConfig.glazes).map(
                    ([section, glazes], sectionIndex) => {
                      return {
                        key: sectionIndex,
                        label: section,
                        children: (
                          <GlazeSection sectionName={section} glazes={glazes} />
                        ),
                      };
                    }
                  )}
                />
                <Button
                  style={{ marginTop: "1rem" }}
                  type="primary"
                  onClick={() => addGlazeSection()}
                >
                  New Glaze Section
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
