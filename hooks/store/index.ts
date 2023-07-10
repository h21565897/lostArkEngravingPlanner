import { configureStore } from "@reduxjs/toolkit";
import { gearStorageSlice } from "./gearStorage";
import { calculationResultSlice } from "./calculationResult";
export const store = configureStore({
  reducer: {
    gearStorage: gearStorageSlice.reducer,
    calculationResult: calculationResultSlice.reducer,
  },
});
