import { EquipStats, generateEquips } from "@/common/EngravingSolver";
import { AccessoryNames } from "@/types";
const neckLanceStat: EquipStats = {
  engraving1: 10,
  engraving2: 10,
  effect1: 0,
  effect2: 0,
  type: AccessoryNames.NeckLance,
};
const result = generateEquips(
  neckLanceStat,
  ["Adrenaline", "Cursed Doll"],
  ["crit", "swift"]
);
console.log(JSON.stringify(result));
