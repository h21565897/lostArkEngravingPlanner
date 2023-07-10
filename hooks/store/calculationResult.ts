import { CalculationFormValueType, CalculationResultType } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: {
  calculationResults: CalculationResultType[];
  calculationTarget: CalculationFormValueType;
} = {
  calculationResults: [],
  calculationTarget: {
    effects: [],
    engravings: [],
    ignoreSlots: [],
  },
};
export const calculationResultSlice = createSlice({
  name: "calculationResult",
  initialState,
  reducers: {
    setCalculationResult: (
      state,
      action: PayloadAction<CalculationResultType[]>
    ) => {
      return {
        ...state,
        calculationResults: action.payload,
      };
    },
    setCalculationTarget: (
      state,
      action: PayloadAction<CalculationFormValueType>
    ) => {
      return {
        ...state,
        calculationTarget: action.payload,
      };
    },
  },
});
export const { setCalculationResult, setCalculationTarget } =
  calculationResultSlice.actions;
