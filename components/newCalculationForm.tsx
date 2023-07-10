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
import React from "react";
const engravingOptions = engravingNames.map((item) => {
  return {
    value: item,
    label: item,
  };
});
export const gearTypes = [
  "abilityStone",
  "necklance",
  "engraving1",
  "engraving2",
  "earring1",
  "earring2",
  "ring1",
  "ring2",
];

function Page({
  onSubmit,
  onSuccessFulCallback,
}: {
  onSubmit?: (values: CalculationFormValueType) => void;
  onSuccessFulCallback?: () => void;
}) {
  const [form] = Form.useForm<FormValueType>();
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
    worker.postMessage({
      targetEffects: values.effects || [],
      targetEngravings: values.engravings || [],
      ignoreSlots: values.ignoreSlots || [],
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
                console.log(effects);
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
                console.log(engravings);
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
        <Form.Item name={"ignoreSlots"} label="GearSet">
          <Checkbox.Group options={gearTypes}></Checkbox.Group>
        </Form.Item>
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
