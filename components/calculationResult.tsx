"use client";
import {
  AccessoryNames,
  AccessoryType,
  CalculationFormValueType,
  CalculationResultType,
} from "@/types";
import React, { useEffect, useState } from "react";
import { Button, Divider, Pagination, Popover } from "antd";
import Image from "next/image";
import { getAccessoryImage, getEngravingImage } from "@/common/imageUtils";

type Props = {
  gearSet: CalculationResultType;
  calculationTargets: CalculationFormValueType;
};

const GearDetails = ({ gear }: { gear: AccessoryType }) => (
  <div>
    {gear.effect1.name == "stub" ? null : (
      <h4>
        {gear.effect1.name}:{gear.effect1.value}
      </h4>
    )}
    {gear.effect2.name == "stub" ? null : (
      <h4>
        {gear.effect2.name}:{gear.effect2.value}
      </h4>
    )}
    {gear.engraving1.name == "stub" ? null : (
      <h4>
        {gear.engraving1.name}:{gear.engraving1.nodes}
      </h4>
    )}
    {gear.engraving2.name == "stub" ? null : (
      <h4>
        {gear.engraving2.name}:{gear.engraving2.nodes}
      </h4>
    )}
  </div>
);
const AdditionalStats = ({ quantity }: { quantity: number }) => {
  console.log("quantity", quantity);
  const color = quantity < 0 ? " text-green-500" : "text-red-500";
  const sign = quantity < 0 ? "" : "+";
  return (
    <h4 className={`${color} mx-2 inline`}>
      {sign}
      {quantity}
    </h4>
  );
};
function Page({ gearSet, calculationTargets }: Props) {
  const [mainSet, setMainSet] = useState(gearSet.mainSet);
  useEffect(() => {
    setMainSet(gearSet.mainSet);
  }, [gearSet]);
  console.log(gearSet.mainSet);
  console.log(mainSet);
  const [currentPage, setCurrentPage] = useState(1);
  let engravings: { name: string; value: number }[] = [];
  let effects: { name: string; value: number }[] = [];
  const engravingMap = new Map<string, number>();
  const effectMap = new Map<string, number>();
  for (const item of mainSet) {
    if (item.effect1.name != "stub") {
      let currentValue = effectMap.get(item.effect1.name) ?? 0;
      effectMap.set(item.effect1.name, currentValue + item.effect1.value);
    }
    if (item.effect2.name != "stub") {
      let currentValue = effectMap.get(item.effect2.name) ?? 0;
      effectMap.set(item.effect2.name, currentValue + item.effect2.value);
    }
    if (item.engraving1.name != "stub") {
      let currentValue = engravingMap.get(item.engraving1.name) ?? 0;
      engravingMap.set(
        item.engraving1.name,
        currentValue + item.engraving1.nodes
      );
    }
    if (item.engraving2.name != "stub") {
      let currentValue = engravingMap.get(item.engraving2.name) ?? 0;
      engravingMap.set(
        item.engraving2.name,
        currentValue + item.engraving2.nodes
      );
    }
  }
  engravingMap.forEach((value, key) => {
    engravings.push({ name: key, value });
  });
  effectMap.forEach((value, key) => {
    effects.push({ name: key, value });
  });
  return (
    <div className="flex w-full px-4 py-4 ">
      <div className="flex flex-col items-center">
        {mainSet.map((item, index) => (
          <Popover
            key={index}
            placement="right"
            content={<GearDetails gear={item} />}
            trigger={["click", "hover"]}
          >
            <div className="w-12 h-12 ">
              <Image
                className="my-2"
                width={50}
                height={50}
                src={
                  item.type == AccessoryNames.Engraving
                    ? getEngravingImage(item.engraving1.name)
                    : getAccessoryImage(item.type)
                }
                alt=""
              ></Image>
            </div>
          </Popover>
        ))}
      </div>
      {gearSet.alternativeSet.length == 0 ? null : (
        <div className="flex flex-col items-center">
          {gearSet.alternativeSet[currentPage - 1].map((item, index) => (
            <Popover
              key={index}
              placement="right"
              content={<GearDetails gear={item} />}
              trigger={["click", "hover"]}
            >
              <div className="w-12 h-12">
                <Image
                  className="my-2"
                  width={50}
                  height={50}
                  src={
                    item.type == AccessoryNames.Engraving
                      ? getEngravingImage(item.engraving1.name)
                      : getAccessoryImage(item.type)
                  }
                  alt=""
                ></Image>
              </div>
            </Popover>
          ))}
          <Button
            type="default"
            className="my-5"
            onClick={() => {
              const updatedGearSet = gearSet.mainSet.map((item, index) => {
                if (item.type == AccessoryNames.Stub) {
                  return gearSet.alternativeSet[currentPage - 1][index];
                }
                return item;
              });
              console.log("updated", updatedGearSet);
              setMainSet((mainSet) => updatedGearSet);
            }}
          >
            Apply
          </Button>
          <Pagination
            simple
            total={gearSet.alternativeSet.length}
            pageSize={1}
            onChange={setCurrentPage}
          ></Pagination>
        </div>
      )}

      <div>
        {engravings.map((item, index) => (
          <div key={index}>
            <h5 className="inline text-white">
              {item.name}:{item.value}
            </h5>
            <h5 className="inline">
              <AdditionalStats
                quantity={
                  item.value -
                  (calculationTargets.engravings.find(
                    (engraving) => engraving.name == item.name
                  )?.nodes || 0)
                }
              ></AdditionalStats>
            </h5>
          </div>
        ))}
      </div>
      <div>
        {effects.map((item, index) => (
          <h5 key={index} className="text-white ">
            {item.name}:{item.value}
          </h5>
        ))}
      </div>
    </div>
  );
}

export default Page;
