export const effectNames = ["crit", "spec", "swift", "stub"] as const;
export const engravingNames = [
  "Grudge",
  "Keen Blunt Weapon",
  "PeaceMaker",
  "Adrenaline",
  "Hit Master",
  "Cursed Doll",
  "stub",
] as const;
export type EngravingType = {
  name: (typeof engravingNames)[number];
  nodes: number;
};

export enum AccessoryNames {
  AbilityStone = "AbilityStone",
  NeckLance = "NeckLance",
  Earring = "Earring",
  Ring = "Ring",
  Engraving = "Engraving",
  Stub = "Stub",
}
export type AccessoryType = {
  id?: number;
  engraving1: EngravingType;
  engraving2: EngravingType;
  effect1: EffectType;
  effect2: EffectType;
  type: AccessoryNames;
};
export type EngravingAccessoryType = AccessoryType & {
  type: AccessoryNames.Engraving;
};

export type EffectType = {
  name: (typeof effectNames)[number];
  value: number;
};
export type NecklanceType = AccessoryType & {
  type: AccessoryNames.NeckLance;
};
export type RingType = AccessoryType & {
  type: AccessoryNames.Ring;
};
export type EarringType = AccessoryType & {
  type: AccessoryNames.Earring;
};
export type AbilityStoneType = AccessoryType & {
  type: AccessoryNames.AbilityStone;
};

export type PlayerSetType = {
  necklace: NecklanceType;
  ring1: RingType;
  ring2: RingType;
  earring1: EarringType;
  earring2: EarringType;
  abilityStone: AbilityStoneType;
  engraving1: EngravingType;
  engraving2: EngravingType;
};
export type calculationParameter = {
  targetEngravings: EngravingType[];
  targetEffects: EffectType[];
  accessories: AccessoryType[];
  ignoreAbilityStone: number;
  ignoreRing: number;
  ignoreNecklace: number;
  ignoreEarring: number;
  ignoreEngraving: number;
};
export type CalculationResultType = {
  mainSet: AccessoryType[];
  alternativeSet: AccessoryType[][];
};
export type CalculationFormValueType = {
  effects: { name: string; value: number }[];
  engravings: { name: string; nodes: number }[];
  ignoreSlots: string[];
};
