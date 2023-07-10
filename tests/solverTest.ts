import { getCC, solveEngraving } from "@/common/EngravingSolver";
import { EffectType, EngravingType } from "@/types";

const targetEngravings: EngravingType[] = [
  {
    name: "Grudge",
    nodes: 15,
  },
  {
    name: "Cursed Doll",
    nodes: 15,
  },
  {
    name: "Adrenaline",
    nodes: 15,
  },
  {
    name: "Hit Master",
    nodes: 15,
  },
  {
    name: "Keen Blunt Weapon",
    nodes: 15,
  },
  {
    name: "PeaceMaker",
    nodes: 10,
  },
];
const targetEffects: EffectType[] = [];
const result = solveEngraving({
  targetEngravings,
  targetEffects,
  availableAblityStones: [],
  availableRings: [],
  availableNecklaces: [],
  availableEarrings: [],
  availableEngravings: [],
  ignoreAbilityStone: 1,
  ignoreRing: 2,
  ignoreNecklace: 1,
  ignoreEarring: 2,
  ignoreEngraving: 2,
});
console.log(JSON.stringify(result));
console.log(getCC());
