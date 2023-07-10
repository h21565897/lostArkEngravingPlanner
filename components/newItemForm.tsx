"use client";
import React, { useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
} from "antd";
import Image from "next/image";
import { useAppSelector } from "@/hooks";
import { useGearStorage } from "@/hooks/gearStorage";
import {
  AccessoryNames,
  AccessoryType,
  effectNames,
  engravingNames,
} from "@/types";
import { getAccessoryImage } from "@/common/imageUtils";

const engravingOptions = engravingNames.map((item) => {
  return {
    value: item,
    label: item,
  };
});
const attrTemplateAblityStone = {
  effect1: false,
  effect2: false,
  engraving1: true,
  engraving2: true,
};
const attrTemplateEarring = {
  effect1: true,
  effect2: false,
  engraving1: true,
  engraving2: true,
};
const attrTemplateNecklance = {
  effect1: true,
  effect2: true,
  engraving1: true,
  engraving2: true,
};
const attrTemplateRing = {
  effect1: true,
  effect2: false,
  engraving1: true,
  engraving2: true,
};
const attrTemplateEngraving = {
  effect1: false,
  effect2: false,
  engraving1: true,
  engraving2: false,
};
const getTemplateByName = (type: string) => {
  switch (type) {
    case "AbilityStone":
      return attrTemplateAblityStone;
    case "Earring":
      return attrTemplateEarring;
    case "NeckLance":
      return attrTemplateNecklance;
    case "Ring":
      return attrTemplateRing;
    case "Engraving":
      return attrTemplateEngraving;
    default:
      return attrTemplateAblityStone;
  }
};
type FormValueType = {
  accessoryType: string;
  effect1: { name: string; value: number } | null;
  effect2: { name: string; value: number } | null;
  engraving1: { name: string; value: number } | null;
  engraving2: { name: string; value: number } | null;
};

function Page({
  onSubmitCallback = (result) => {},
}: {
  onSubmitCallback?: (result: boolean) => void;
}) {
  const { doAddAccessory } = useGearStorage();
  const onFinish = (values: FormValueType) => {
    console.log("Success:", values);
    let curFieldTemplate = getTemplateByName(values.accessoryType);

    let accessory: AccessoryType = {
      type: AccessoryNames[values.accessoryType as keyof typeof AccessoryNames],
      effect1: {
        //@ts-ignore
        name: values.effect1?.name || "stub",

        value: values.effect1?.value || 0,
      },
      effect2: {
        //@ts-ignore
        name: values.effect2?.name || "stub",

        value: values.effect2?.value || 0,
      },
      engraving1: {
        //@ts-ignore
        name: values.engraving1?.name || "stub",

        nodes: values.engraving1?.value || 0,
      },
      engraving2: {
        //@ts-ignore
        name: values.engraving2?.name || "stub",

        nodes: values.engraving2?.value || 0,
      },
    };
    if (!curFieldTemplate.effect1) {
      accessory.effect1 = { name: "stub", value: 0 };
    }
    if (!curFieldTemplate.effect2) {
      accessory.effect2 = { name: "stub", value: 0 };
    }
    if (!curFieldTemplate.engraving1) {
      accessory.engraving1 = { name: "stub", nodes: 0 };
    }
    if (!curFieldTemplate.engraving2) {
      accessory.engraving2 = { name: "stub", nodes: 0 };
    }
    doAddAccessory(accessory);
    onSubmitCallback(true);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    onSubmitCallback(false);
  };
  const [form] = Form.useForm<FormValueType>();
  const [curFieldTemplate, setcurFieldTemplate] = useState({
    effect1: false,
    effect2: false,
    engraving1: true,
    engraving2: true,
  });
  const onRadioChange = (e: RadioChangeEvent) => {
    setcurFieldTemplate(getTemplateByName(e.target.value));
    console.log("radio checked", getTemplateByName(e.target.value));
  };
  console.log(curFieldTemplate.effect2);
  const onValueChange = (_: any, values: FormValueType) => {
    setcurFieldTemplate(getTemplateByName(values.accessoryType));
  };
  return (
    <Form
      name="newAccessoryForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
      onValuesChange={onValueChange}
      form={form}
      initialValues={{
        accessoryType: "AbilityStone",
        effect1: { name: "crit", value: 0 },
        effect2: { name: "crit", value: 0 },
        engraving1: { name: "Grudge", value: 0 },
        engraving2: { name: "Grudge", value: 0 },
      }}
    >
      <Form.Item label="Please select one type" name="accessoryType">
        <Radio.Group onChange={onRadioChange}>
          <Radio value={"AbilityStone"}>
            <Image
              width={50}
              height={50}
              src={getAccessoryImage("AbilityStone")}
              alt="Example"
            ></Image>
          </Radio>
          <Radio value={"Earring"}>
            <Image
              width={50}
              height={50}
              src={getAccessoryImage("Earring")}
              alt="Example"
            ></Image>
          </Radio>
          <Radio value={"NeckLance"}>
            <Image
              width={50}
              height={100}
              src={getAccessoryImage("NeckLance")}
              alt="Example"
            ></Image>
          </Radio>
          <Radio value={"Ring"}>
            <Image
              width={50}
              height={50}
              src={getAccessoryImage("Ring")}
              alt="Example"
            ></Image>
          </Radio>
          <Radio value={"Engraving"}>
            <Image
              width={50}
              height={50}
              src={getAccessoryImage("Engraving")}
              alt="I am engraving"
            ></Image>
          </Radio>
        </Radio.Group>
      </Form.Item>
      <div className="flex ">
        <Form.Item name={["effect1", "name"]}>
          <Select
            defaultValue="Select one attribute"
            options={[
              { value: "crit", label: "crit" },
              { value: "swift", label: "swift" },
              { value: "spec", label: "spec" },
            ]}
            disabled={!curFieldTemplate.effect1}
          ></Select>
        </Form.Item>
        <Form.Item
          name={["effect1", "value"]}
          className="w-20"
          rules={[
            {
              required: curFieldTemplate.effect1,
              message: "Please input valid value!",
            },
          ]}
        >
          <InputNumber
            disabled={!curFieldTemplate.effect1}
            placeholder="attr value here"
          ></InputNumber>
        </Form.Item>
      </div>
      <div className="flex ">
        <Form.Item name={["effect2", "name"]}>
          <Select
            defaultValue="Select one attribute"
            options={[
              { value: "crit", label: "crit" },
              { value: "swift", label: "swift" },
              { value: "spec", label: "spec" },
            ]}
            disabled={!curFieldTemplate.effect2}
          ></Select>
        </Form.Item>
        <Form.Item
          name={["effect2", "value"]}
          className="w-20"
          rules={[
            {
              required: curFieldTemplate.effect2,
              message: "Please input valid value!",
            },
          ]}
        >
          <InputNumber
            placeholder="attr value here"
            disabled={!curFieldTemplate.effect2}
          ></InputNumber>
        </Form.Item>
      </div>
      <div className="flex ">
        <Form.Item
          name={["engraving1", "name"]}
          rules={
            curFieldTemplate.engraving1 && curFieldTemplate.engraving2
              ? [
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue(["engraving2", "name"]) == value) {
                        return Promise.reject(
                          new Error("cannot have same engraving")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]
              : []
          }
        >
          <Select
            disabled={!curFieldTemplate.engraving1}
            defaultValue="Select one engraving"
            options={engravingOptions}
          ></Select>
        </Form.Item>
        <Form.Item
          name={["engraving1", "value"]}
          className="w-20"
          rules={[
            {
              required: curFieldTemplate.engraving1,
              message: "Please input valid value!",
            },
          ]}
        >
          <InputNumber
            disabled={!curFieldTemplate.engraving1}
            placeholder="attr value here"
          ></InputNumber>
        </Form.Item>
      </div>
      <div className="flex ">
        <Form.Item name={["engraving2", "name"]}>
          <Select
            disabled={!curFieldTemplate.engraving2}
            defaultValue="Select one engraving"
            options={engravingOptions}
          ></Select>
        </Form.Item>
        <Form.Item
          name={["engraving2", "value"]}
          className="w-20"
          rules={[
            {
              required: curFieldTemplate.engraving2,
              message: "Please input valid value!",
            },
          ]}
        >
          <InputNumber
            placeholder="attr value here"
            disabled={!curFieldTemplate.engraving2}
          ></InputNumber>
        </Form.Item>
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Page;
