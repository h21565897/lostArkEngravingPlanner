import { CalculationFormValueType, CalculationResultType } from "@/types";
import { useAppDispatch, useAppSelector } from ".";
import {
  setCalculationTarget,
  setCalculationResult,
} from "./store/calculationResult";

export const useCalculationResult = () => {
  const { calculationResults, calculationTarget } = useAppSelector(
    (state) => state.calculationResult
  );
  const dispatch = useAppDispatch();
  const doSetCalculationTarget = (
    calculationResult: CalculationFormValueType
  ) => {
    dispatch(setCalculationTarget(calculationResult));
  };
  const doSetCalculationResult = (
    calculationResult: CalculationResultType[]
  ) => {
    dispatch(setCalculationResult(calculationResult));
  };
  return {
    calculationResults,
    calculationTarget,
    doSetCalculationTarget,
    doSetCalculationResult,
  };
};
