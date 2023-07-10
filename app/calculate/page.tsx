"use client";
import {
  CalculationFormValueType,
  CalculationResultType,
  engravingNames,
} from "@/types";
/* eslint-disable react/jsx-key */
import {
  MinusCircleFilled,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import NewCalculationForm from "@/components/newCalculationForm";
import CalculationResultForm from "@/components/calculationResult";
import { useCalculationResult } from "@/hooks/calculationResult";
// import * as mockResultsI from "./t2.json";
type FromValueType = {
  effects: { name: string; value: number }[];
  engravings: { name: string; value: number }[];
  ignoreSlots: string[];
};
// const mockResults: [] = mockResultsI;
function Page() {
  const [visible, setVisible] = useState(false);
  const {
    calculationResults,
    doSetCalculationResult,
    doSetCalculationTarget,
    calculationTarget,
  } = useCalculationResult();
  const [currentPage, setCurrentPage] = useState(1);
  const onCancel = () => {
    setVisible(false);
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        icon={<PlusOutlined />}
        onClick={() => {
          setVisible(true);
        }}
      >
        New Calculation
      </Button>
      {calculationResults.length == 0 ? null : (
        <div className="flex flex-col items-center justify-center w-full ">
          <CalculationResultForm
            gearSet={calculationResults[currentPage - 1]}
            calculationTargets={calculationTarget}
          ></CalculationResultForm>
          <Divider></Divider>
          <Pagination
            total={calculationResults.length}
            pageSize={1}
            onChange={setCurrentPage}
          ></Pagination>
        </div>
      )}
      <Modal forceRender open={visible} footer={null} onCancel={onCancel}>
        <NewCalculationForm
          onSuccessFulCallback={() => {
            setVisible(false);
          }}
        ></NewCalculationForm>
      </Modal>
    </div>
  );
}

export default Page;
