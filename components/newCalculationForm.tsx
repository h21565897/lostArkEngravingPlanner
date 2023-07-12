"use client";
import { useCalculationResult } from "@/hooks/calculationResult";
import { useGearStorage } from "@/hooks/gearStorage";
import { CalculationFormValueType, engravingNames } from "@/types";
import { CalculationFormValueType as FormValueType } from "@/types";
/* eslint-disable react/jsx-key */
import {
  MinusCircleFilled,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
const engravingOptions = engravingNames.map((item) => {
  return {
    value: item,
    label: item,
  };
});
export const gearTemplates: {
  [key: string]: {
    min: number;
    max: number;
    template: {
      effect1: boolean;
      effect2: boolean;
      engraving1: boolean;
      engraving2: boolean;
    };
  };
} = {
  NeckLance: {
    min: 1,
    max: 1,
    template: {
      effect1: true,
      effect2: true,
      engraving1: true,
      engraving2: true,
    },
  },
  Ring: {
    min: 1,
    max: 2,
    template: {
      effect1: true,
      effect2: false,
      engraving1: true,
      engraving2: true,
    },
  },
  Earring: {
    min: 1,
    max: 2,
    template: {
      effect1: true,
      effect2: false,
      engraving1: true,
      engraving2: true,
    },
  },
  Engraving: {
    min: 1,
    max: 2,
    template: {
      effect1: false,
      effect2: false,
      engraving1: true,
      engraving2: false,
    },
  },
  AbilityStone: {
    min: 1,
    max: 1,
    template: {
      effect1: false,
      effect2: false,
      engraving1: true,
      engraving2: true,
    },
  },
};
const gearOptions = Object.keys(gearTemplates).map((item) => {
  return {
    value: item,
    label: item,
  };
});
function Page({
  onSubmit,
  onSuccessFulCallback,
}: {
  onSubmit?: (values: CalculationFormValueType) => void;
  onSuccessFulCallback?: () => void;
}) {
  const [form] = Form.useForm<FormValueType>();
  const [customSlotStats, setCustomSlotStats] = useState<string[]>([]);
  console.log("refreshed");
  const { doSetCalculationResult, doSetCalculationTarget } =
    useCalculationResult();
  const { gearStorage } = useGearStorage();
  const onFinish = (values: FormValueType) => {
    const worker = new Worker(
      new URL("../workers/calculationWorker.ts", import.meta.url)
    );
    worker.onmessage = (event) => {
      console.log("calculation result", event.data);
      if (event.data.length > 0) {
        console.log("event", event.data);
        doSetCalculationResult(event.data);
        doSetCalculationTarget(values);
      } else {
        doSetCalculationResult([]);
        doSetCalculationTarget(values);
      }
      if (onSuccessFulCallback) {
        onSuccessFulCallback();
      }
      alert("calculation finished");
    };
    console.log("calcutorage:", gearStorage);
    values.customSlots = values.customSlots.map((item) => {
      return {
        ...item,
        effect1: gearTemplates[item.name].template.effect1 ? item.effect1 : 0,
        effect2: gearTemplates[item.name].template.effect2 ? item.effect2 : 0,
        engraving1: gearTemplates[item.name].template.engraving1
          ? item.engraving1
          : 0,
        engraving2: gearTemplates[item.name].template.engraving2
          ? item.engraving2
          : 0,
      };
    });
    worker.postMessage({
      targetEffects: values.effects || [],
      targetEngravings: values.engravings || [],
      customSlots: values.customSlots || [],
      accessories: gearStorage,
    });
    console.log(values);
  };
  return (
    <div className="px-2 py-2">
      <Form name="form1" form={form} onFinish={onFinish} layout="vertical">
        <h2 className="my-2">Targets</h2>
        <Form.List
          name="effects"
          rules={[
            {
              validator: async (_, effects) => {
                if (effects)
                  for (let i = 0; i < effects.length; i++) {
                    for (let j = i + 1; j < effects.length; j++) {
                      if (effects[i] && effects[j])
                        if (effects[i].name == effects[j].name) {
                          console.log("effect names should be unique");
                          return Promise.reject(
                            new Error("effect names should be unique")
                          );
                        }
                    }
                  }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => {
                return (
                  <Space key={key} style={{ display: "flex" }} align="baseline">
                    <Form.Item
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Please choose a effect!",
                        },
                      ]}
                    >
                      <Select
                        defaultValue="Select one attribute"
                        options={[
                          { value: "crit", label: "crit" },
                          { value: "swift", label: "swift" },
                          { value: "spec", label: "spec" },
                        ]}
                      ></Select>
                    </Form.Item>
                    <Form.Item
                      name={[name, "value"]}
                      className="w-20"
                      rules={[
                        {
                          required: true,
                          message: "Please input valid value!",
                          type: "number",
                          transform: (value) => Number(value),
                        },
                      ]}
                    >
                      <InputNumber placeholder="attr value here"></InputNumber>
                    </Form.Item>
                    <MinusCircleOutlined
                      className="px-2"
                      onClick={() => {
                        remove(name);
                      }}
                    ></MinusCircleOutlined>
                  </Space>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  icon={<PlusOutlined></PlusOutlined>}
                  onClick={() => {
                    add();
                  }}
                >
                  Add Effect
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.List
          name="engravings"
          rules={[
            {
              validator: async (_, engravings) => {
                if (engravings)
                  for (let i = 0; i < engravings.length; i++) {
                    for (let j = i + 1; j < engravings.length; j++) {
                      if (engravings[i] && engravings[j])
                        if (engravings[i].name == engravings[j].name) {
                          console.log("engraving names should be unique");
                          return Promise.reject(
                            new Error("engraving names should be unique")
                          );
                        }
                    }
                  }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => {
                return (
                  <Space key={key} style={{ display: "flex" }} align="baseline">
                    <Form.Item
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Please choose a engraving!",
                        },
                      ]}
                    >
                      <Select
                        defaultValue="Select one engraving"
                        options={engravingOptions}
                      ></Select>
                    </Form.Item>
                    <Form.Item
                      name={[name, "nodes"]}
                      className="w-20"
                      rules={[
                        {
                          required: true,
                          message: "Please input valid value!",
                          type: "number",
                          transform: (value) => Number(value),
                        },
                      ]}
                    >
                      <InputNumber placeholder="attr value here"></InputNumber>
                    </Form.Item>
                    <MinusCircleOutlined
                      className="px-2"
                      onClick={() => {
                        remove(name);
                        console.log(key, name);
                      }}
                    ></MinusCircleOutlined>
                  </Space>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  icon={<PlusOutlined></PlusOutlined>}
                  onClick={() => {
                    add();
                  }}
                >
                  Add Engraving
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.List
          name="customSlots"
          rules={[
            {
              validator: async (_, customSlots) => {
                if (customSlots)
                  for (let i = 0; i < customSlots.length; i++) {
                    for (let j = i + 1; j < customSlots.length; j++) {
                      if (customSlots[i] && customSlots[j])
                        if (customSlots[i].name == customSlots[j].name) {
                          console.log("customSlot should be unique");
                          return Promise.reject(
                            new Error("customSlot should be unique")
                          );
                        }
                    }
                  }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => {
                return (
                  <div key={key} className="flex flex-col gap-0">
                    <div className="flex items-baseline gap-2">
                      <Form.Item
                        name={[name, "name"]}
                        rules={[
                          {
                            required: true,
                            message: "Please choose a slot!",
                          },
                        ]}
                      >
                        <Select
                          defaultValue="Select one slot"
                          onChange={(value) => {
                            setCustomSlotStats((prev) => {
                              return {
                                ...prev,
                                [name]: value,
                              };
                            });
                          }}
                          options={gearOptions}
                        ></Select>
                      </Form.Item>
                      <Form.Item
                        name={[name, "nums"]}
                        className="w-20"
                        rules={[
                          {
                            required: true,
                            message: "Please input valid value!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={gearTemplates?.[customSlotStats[name]]?.min}
                          max={gearTemplates?.[customSlotStats[name]]?.max}
                          placeholder="slots"
                        ></InputNumber>
                      </Form.Item>

                      <MinusCircleOutlined
                        className="px-2"
                        onClick={() => {
                          remove(name);
                          console.log(key, name);
                        }}
                      ></MinusCircleOutlined>
                    </div>
                    <div className="flex gap-1">
                      <Form.Item
                        name={[name, "effect1"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input valid value!",
                          },
                        ]}
                      >
                        <InputNumber
                          disabled={
                            !gearTemplates?.[customSlotStats[name]]?.template
                              ?.effect1
                          }
                          min={1}
                          className="w-36"
                          placeholder="effect1 max"
                        ></InputNumber>
                      </Form.Item>
                      <Form.Item
                        name={[name, "effect2"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input valid value!",
                          },
                        ]}
                      >
                        <InputNumber
                          disabled={
                            !gearTemplates?.[customSlotStats[name]]?.template
                              ?.effect2
                          }
                          min={1}
                          className="w-36"
                          placeholder="effect2 max"
                        ></InputNumber>
                      </Form.Item>
                    </div>
                    <div className="flex gap-1">
                      <Form.Item
                        name={[name, "engraving1"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input valid value!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          disabled={
                            !gearTemplates?.[customSlotStats[name]]?.template
                              ?.engraving1
                          }
                          className="w-36"
                          placeholder="engraving1 max"
                        ></InputNumber>
                      </Form.Item>
                      <Form.Item
                        name={[name, "engraving2"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input valid value!",
                          },
                        ]}
                      >
                        <InputNumber
                          disabled={
                            !gearTemplates?.[customSlotStats[name]]?.template
                              ?.engraving2
                          }
                          min={1}
                          className="w-36"
                          placeholder="engraving2 max"
                        ></InputNumber>
                      </Form.Item>
                    </div>
                  </div>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  icon={<PlusOutlined></PlusOutlined>}
                  onClick={() => {
                    add();
                  }}
                >
                  Add Custom Slots
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Page;
