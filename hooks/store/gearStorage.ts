import {
  AbilityStoneType,
  AccessoryType,
  EarringType,
  EngravingType,
  NecklanceType,
  RingType,
} from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: AccessoryType[] = [];
export const gearStorageSlice = createSlice({
  name: "gearStorage",
  initialState,
  reducers: {
    addAccessory: (state, action: PayloadAction<AccessoryType>) => {
      state.push(action.payload);
    },
    removeAccessory: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
    },
  },
});
export const { addAccessory, removeAccessory } = gearStorageSlice.actions;
