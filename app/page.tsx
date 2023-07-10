"use client";
import NewItemForm from "@/components/newItemForm";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Button, Divider, Modal } from "antd";
import Table, { ColumnsType, TablePaginationConfig } from "antd/es/table";
import Image from "next/image";
import { useState } from "react";
import Earring from "@/assets/earring.png";
import Necklance from "@/assets/necklance.png";
import Ring from "@/assets/ring.png";
import Engraving from "@/assets/engraving.png";
import AbilityStone from "@/assets/abilityStone.png";
import { AccessoryNames } from "@/types";
import { useGearStorage } from "@/hooks/gearStorage";
export default function Home() {
  const { gearStorage, doRemoveAccessory } = useGearStorage();
  const dataSource = gearStorage.map((item, index) => {
    return {
      ...item,
      key: index,
    };
  });
  const column: ColumnsType<(typeof dataSource)[number]> = [
    {
      title: "type",
      key: "type",
      render: (_, { type }) => {
        console.log(type);
        return (
          <>
            {type === AccessoryNames.Earring ? (
              <Image src={Earring} alt="earring" width={50} height={50} />
            ) : type === AccessoryNames.NeckLance ? (
              <Image src={Necklance} alt="necklance" width={50} height={50} />
            ) : type === AccessoryNames.Ring ? (
              <Image src={Ring} alt="ring" width={50} height={50} />
            ) : type === AccessoryNames.Engraving ? (
              <Image src={Engraving} alt="engraving" width={50} height={50} />
            ) : type === AccessoryNames.AbilityStone ? (
              <Image
                src={AbilityStone}
                alt="abilityStone"
                width={50}
                height={50}
              />
            ) : null}
          </>
        );
      },
    },
    {
      title: "effect1Name",
      key: "effect1Name",
      render: (_, { effect1 }) => {
        return <>{effect1.name}</>;
      },
    },
    {
      title: "effect1Value",
      key: "effect1Value",
      render: (_, { effect1 }) => {
        return <>{effect1.value}</>;
      },
    },
    {
      title: "effect2Name",
      key: "effect2Name",
      render: (_, { effect2 }) => {
        return <>{effect2.name}</>;
      },
    },
    {
      title: "effect2Value",
      key: "effect2Value",
      render: (_, { effect2 }) => {
        return <>{effect2.value}</>;
      },
    },
    {
      title: "engraving1",
      key: "engraving1",
      render: (_, { engraving1 }) => {
        return <>{engraving1.name}</>;
      },
    },
    {
      title: "engraving1Value",
      key: "engraving1Value",
      render: (_, { engraving1 }) => {
        return <>{engraving1.nodes}</>;
      },
    },
    {
      title: "engraving2",
      key: "engraving2",
      render: (_, { engraving2 }) => {
        return <>{engraving2.name}</>;
      },
    },
    {
      title: "engraving2Value",
      key: "engraving2Value",
      render: (_, { engraving2 }) => {
        return <>{engraving2.nodes}</>;
      },
    },
    {
      title: "operations",
      key: "operations",
      render: (_, record, index) => {
        return (
          <>
            <Button
              onClick={() => {
                console.log("record:", record);
                doRemoveAccessory(record.key);
              }}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <div className="px-2 py-2 bg-slate-800">
      <Table
        dataSource={dataSource}
        columns={column}
        pagination={{ pageSize: 7 }}
      ></Table>
    </div>
  );
}
