import { AccessoryType } from "@/types";
import { useAppSelector } from ".";
import { useDispatch } from "react-redux";
import { addAccessory, removeAccessory } from "./store/gearStorage";
export const useGearStorage = () => {
  const { gearStorage } = useAppSelector((state) => state);
  const dispatch = useDispatch();
  const doAddAccessory = (accessory: AccessoryType) => {
    dispatch(addAccessory(accessory));
  };
  const doRemoveAccessory = (index: number) => {
    dispatch(removeAccessory(index));
  };
  const setGearStorage = (gearStorage: AccessoryType[]) => {
    gearStorage.forEach((accessory) => {
      dispatch(addAccessory(accessory));
    });
  };
  return {
    gearStorage,
    doAddAccessory,
    doRemoveAccessory,
    setGearStorage,
  };
};
