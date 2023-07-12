import {
  AbilityStoneType,
  AccessoryNames,
  AccessoryType,
  CalculationResultType,
  EarringType,
  EffectType,
  EngravingAccessoryType,
  EngravingType,
  NecklanceType,
  PlayerSetType,
  RingType,
  effectNames,
  engravingNames,
} from "@/types";
import { current } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { TemplateContext } from "next/dist/shared/lib/app-router-context";
import { Allerta, Pinyon_Script } from "next/font/google";
import { type } from "os";
const accessoryStub: AccessoryType = {
  engraving1: {
    name: "stub",
    nodes: 0,
  },
  engraving2: {
    name: "stub",
    nodes: 0,
  },
  effect1: {
    name: "stub",
    value: 0,
  },
  effect2: {
    name: "stub",
    value: 0,
  },
  type: AccessoryNames.Stub,
};
const accessoryStubSet: AccessoryType[] = [accessoryStub];
export type GenerateTempalteType = {
  necklance: EquipStats;
  earring: EquipStats;
  ring: EquipStats;
  abilityStone: EquipStats;
  engraving: EquipStats;
};
export function solveEngraving({
  targetEngravings,
  targetEffects,
  availableAblityStones,
  availableRings,
  availableNecklaces,
  availableEarrings,
  availableEngravings,
  ignoreAbilityStone = 0,
  ignoreRing = 0,
  ignoreNecklace = 0,
  ignoreEarring = 0,
  ignoreEngraving = 0,
  generateTemplates,
}: {
  targetEngravings: EngravingType[];
  targetEffects: EffectType[];
  availableAblityStones: AbilityStoneType[];
  availableRings: RingType[];
  availableNecklaces: NecklanceType[];
  availableEarrings: EarringType[];
  availableEngravings: EngravingAccessoryType[];
  ignoreAbilityStone?: number;
  ignoreRing?: number;
  ignoreNecklace?: number;
  ignoreEarring?: number;
  ignoreEngraving?: number;
  generateTemplates?: GenerateTempalteType;
}): CalculationResultType[] {
  generateTemplates = {
    necklance: neckLanceStat,
    earring: earringStat,
    ring: ringStat,
    abilityStone: abilityStoneStat,
    engraving: engravingStat,
    ...generateTemplates,
  };
  console.log("inside solver", generateTemplates);
  let targetEngravingMap = new Map<string, number>();
  let targetEffectMap = new Map<string, number>();
  let currentEngravingMap = new Map<string, number>();
  let currentEffectMap = new Map<string, number>();
  for (const engraving of targetEngravings) {
    targetEngravingMap.set(engraving.name, engraving.nodes);
    currentEngravingMap.set(engraving.name, 0);
  }

  for (const effect of targetEffects) {
    targetEffectMap.set(effect.name, effect.value);
    currentEffectMap.set(effect.name, 0);
  }
  if (availableAblityStones.length == 0) ignoreAbilityStone = 1;
  if (availableRings.length < 2) ignoreRing = 2 - availableRings.length;
  if (availableNecklaces.length == 0) ignoreNecklace = 1;
  if (availableEarrings.length < 2)
    ignoreEarring = 2 - availableEarrings.length;
  if (availableEngravings.length < 2)
    ignoreEngraving = 2 - availableEngravings.length;

  //console.log("targetEngravingMap", targetEngravingMap);
  //console.log("targetEffectMap", targetEffectMap);
  let accepatableEngravingGap =
    9 * (ignoreEarring + ignoreNecklace + ignoreRing) +
    ignoreEngraving * 12 +
    ignoreAbilityStone * 20;
  let acceptableEffectGap =
    300 * (ignoreEarring + ignoreRing) + 600 * ignoreNecklace;
  let necklanceSet = ignoreNecklace ? accessoryStubSet : availableNecklaces;
  let engravingSet1 =
    ignoreEngraving > 0 ? accessoryStubSet : availableEngravings;
  let engravingSet2 =
    ignoreEngraving > 1 ? accessoryStubSet : availableEngravings;
  let ringSet1 = ignoreRing > 0 ? accessoryStubSet : availableRings;
  let ringSet2 = ignoreRing > 1 ? accessoryStubSet : availableRings;
  let abilityStoneSet = ignoreAbilityStone
    ? accessoryStubSet
    : availableAblityStones;
  let earringSet1 = ignoreEarring > 0 ? accessoryStubSet : availableEarrings;
  let earringSet2 = ignoreEarring > 1 ? accessoryStubSet : availableEarrings;
  let resultSet: AccessoryType[][] = [];
  let currensSet: AccessoryType[] = [];

  console.log("necklanceSet", necklanceSet);
  console.log("engravingSet1", engravingSet1);
  console.log("engravingSet2", engravingSet2);
  console.log("ringSet1", ringSet1);
  console.log("ringSet2", ringSet2);
  console.log("abilityStoneSet", abilityStoneSet);
  console.log("earringSet1", earringSet1);
  console.log("earringSet2", earringSet2);
  console.log(currentEffectMap, currentEngravingMap);
  searchType(
    [
      necklanceSet,
      earringSet1,
      earringSet2,
      ringSet1,
      ringSet2,
      abilityStoneSet,
      engravingSet1,
      engravingSet2,
    ],
    targetEngravingMap,
    targetEffectMap,
    currentEngravingMap,
    currentEffectMap,
    currensSet,
    0,
    0,
    accepatableEngravingGap,
    acceptableEffectGap,
    resultSet
  );
  //console.log("resultSet:", resultSet);
  let results: CalculationResultType[] = [];
  for (const [index, currentSet] of resultSet.entries()) {
    let alternativeSets = searchForPossbileStubs(
      currentSet,
      targetEngravingMap,
      targetEffectMap,
      ignoreAbilityStone,
      ignoreRing,
      ignoreNecklace,
      ignoreEarring,
      ignoreEngraving,
      generateTemplates
    );
    results.push({
      mainSet: currentSet,
      alternativeSet: alternativeSets,
    });
  }
  return results;
}

export function searchForPossbileStubs(
  playerSet: AccessoryType[],
  targetEngravingMapP: Map<string, number>,
  targetEffectMapP: Map<string, number>,
  ignoreAbilityStone = 0,
  ignoreRing = 0,
  ignoreNecklace = 0,
  ignoreEarring = 0,
  ignoreEngraving = 0,
  generateTemplates = {
    necklance: neckLanceStat,
    earring: earringStat,
    ring: ringStat,
    abilityStone: abilityStoneStat,
    engraving: engravingStat,
  }
): AccessoryType[][] {
  let targetEngravingMap = cloneDeep(targetEngravingMapP);
  let targetEffectMap = cloneDeep(targetEffectMapP);
  for (const accessory of playerSet) {
    const currentEngraving1 =
      targetEngravingMap.get(accessory.engraving1.name) ?? 0;
    const currentEngraving2 =
      targetEngravingMap.get(accessory.engraving2.name) ?? 0;
    const currentEffect1 = targetEffectMap.get(accessory.effect1.name) ?? 0;
    const currentEffect2 = targetEffectMap.get(accessory.effect2.name) ?? 0;
    targetEngravingMap.set(
      accessory.engraving1.name,
      currentEngraving1 - accessory.engraving1.nodes
    );
    targetEngravingMap.set(
      accessory.engraving2.name,
      currentEngraving2 - accessory.engraving2.nodes
    );
    targetEffectMap.set(
      accessory.effect1.name,
      currentEffect1 - accessory.effect1.value
    );
    targetEffectMap.set(
      accessory.effect2.name,
      currentEffect2 - accessory.effect2.value
    );
  }
  for (const [key, value] of targetEngravingMap.entries()) {
    if (value <= 0) {
      targetEngravingMap.delete(key);
    }
  }

  for (const [key, value] of targetEffectMap.entries()) {
    if (value <= 0) {
      targetEffectMap.delete(key);
    }
  }
  let currentEngravingMap = new Map<string, number>();
  let currentEffectMap = new Map<string, number>();
  for (const [name, nodes] of targetEngravingMap) {
    currentEngravingMap.set(name, 0);
  }

  for (const [name, value] of targetEffectMap) {
    currentEffectMap.set(name, 0);
  }
  let resultsSet: AccessoryType[][] = [];
  let currentSet: AccessoryType[] = [];
  let targetEngravingNames = Array.from(
    targetEngravingMap.keys()
  ) as (typeof engravingNames)[number][];
  let targetEffectNames = Array.from(
    targetEffectMap.keys()
  ) as (typeof effectNames)[number][];
  //console.log("targetEngravingNames", targetEngravingMap);
  //console.log("targetEffectNames", targetEffectMap);
  let necklanceSet =
    ignoreNecklace > 0
      ? generateEquips(
          generateTemplates.necklance,
          targetEngravingNames,
          targetEffectNames
        )
      : accessoryStubSet;
  let earringSet1 =
    ignoreEarring > 0
      ? generateEquips(
          generateTemplates.earring,
          targetEngravingNames,
          targetEffectNames
        )
      : accessoryStubSet;
  let earringSet2 = ignoreEarring > 1 ? earringSet1 : accessoryStubSet;
  let ringSet1 =
    ignoreRing > 0
      ? generateEquips(
          generateTemplates.ring,
          targetEngravingNames,
          targetEffectNames
        )
      : accessoryStubSet;
  let ringSet2 = ignoreRing > 1 ? ringSet1 : accessoryStubSet;
  let abilityStoneSet =
    ignoreAbilityStone > 0
      ? generateEquips(
          generateTemplates.abilityStone,
          targetEngravingNames,
          targetEffectNames
        )
      : accessoryStubSet;
  let engravingSet1 =
    ignoreEngraving > 0
      ? generateEquips(
          generateTemplates.engraving,
          targetEngravingNames,
          targetEffectNames
        )
      : accessoryStubSet;
  let engravingSet2 = ignoreEngraving > 1 ? engravingSet1 : accessoryStubSet;
  // console.log(
  //   "length:",
  //   necklanceSet.length,
  //   earringSet1.length,
  //   earringSet2.length,
  //   ringSet1.length,
  //   ringSet2.length,
  //   engravingSet1.length,
  //   engravingSet2.length,
  //   abilityStoneSet.length
  // );
  searchType(
    [
      necklanceSet,
      earringSet1,
      earringSet2,
      ringSet1,
      ringSet2,
      abilityStoneSet,
      engravingSet1,
      engravingSet2,
    ],
    targetEngravingMap,
    targetEffectMap,
    currentEngravingMap,
    currentEffectMap,
    currentSet,
    0,
    0,
    0,
    0,
    resultsSet,
    true
  );

  return resultsSet;
}

//loop iteration number counter
let cc = 0;

function searchType(
  allEquips: AccessoryType[][],
  targetEngravingMap: Map<string, number>,
  targetEffectMap: Map<string, number>,
  currentEngravingMap: Map<string, number>,
  currentEffectMap: Map<string, number>,
  currentSet: AccessoryType[],
  currentSlot: number,
  currentIndex: number,
  acceptableEngravingGap: number,
  acceptableEffectGap: number,
  resultSet: AccessoryType[][],
  strict = false
) {
  cc++;
  if (currentSlot == allEquips.length) {
    console.log("preparing push to result");
    let sumOfCurrentEngravings = 0;
    let sumOfEngravings = 0;
    if (!strict) {
      for (const [key, value] of targetEngravingMap.entries()) {
        sumOfEngravings += value;
        let current = currentEngravingMap.get(key) ?? 0;
        //most strict cut(not exceed 15)
        if (current > 15) current = 15;
        sumOfCurrentEngravings += current;
        if (sumOfCurrentEngravings + acceptableEngravingGap < sumOfEngravings) {
          return;
        }
      }
      let sumOfCurrentEffects = 0;
      let sumOfEffects = 0;
      for (const [key, value] of targetEffectMap.entries()) {
        sumOfEffects += value;
        const current = currentEffectMap.get(key) ?? 0;
        sumOfCurrentEffects += current;
        if (sumOfCurrentEffects + acceptableEffectGap < sumOfEffects) {
          return;
        }
      }
    } else {
      for (const [key, value] of targetEngravingMap.entries()) {
        const current = currentEngravingMap.get(key) ?? 0;
        if (current < value) return;
      }
      for (const [key, value] of targetEffectMap.entries()) {
        const current = currentEffectMap.get(key) ?? 0;
        if (current < value) return;
      }
    }
    resultSet.push(currentSet.slice(0));
    return;
  }

  const currentEquips = allEquips[currentSlot];
  //temproray fix
  if (currentEquips.length == 0) {
    return;
  }
  const currentEquipType = currentEquips[0].type;
  console.log("currentEquipType", currentEquipType);
  let nextDup = false;
  if (
    (currentEquipType == AccessoryNames.Ring ||
      currentEquipType == AccessoryNames.Earring ||
      currentEquipType == AccessoryNames.Engraving) &&
    currentIndex == 0
  ) {
    nextDup = true;
  }
  //if current is a Stub, just start from 0
  if (currentEquipType == AccessoryNames.Stub) {
    currentIndex = 0;
  }
  for (let i = currentIndex; i < currentEquips.length; i++) {
    const currentEquip = currentEquips[i];
    //ugly cut here
    let [currentEngraving1, currentEngraving2, currentEffect1, currentEffect2] =
      engravingAndEffectSetHelper(
        currentEngravingMap,
        currentEffectMap,
        currentEquip
      );
    if (currentEngraving1 == -1) continue;
    currentSet.push(currentEquip);
    let nextIndex = 0;
    if (nextDup) {
      nextIndex = i + 1;
    }
    searchType(
      allEquips,
      targetEngravingMap,
      targetEffectMap,
      currentEngravingMap,
      currentEffectMap,
      currentSet,
      currentSlot + 1,
      nextIndex,
      acceptableEngravingGap,
      acceptableEffectGap,
      resultSet,
      strict
    );
    currentSet.splice(-1, 1);
    currentEngravingMap.set(currentEquip.engraving1.name, currentEngraving1);
    currentEngravingMap.set(currentEquip.engraving2.name, currentEngraving2);
    currentEffectMap.set(currentEquip.effect1.name, currentEffect1);
    currentEffectMap.set(currentEquip.effect2.name, currentEffect2);
  }
}

function engravingAndEffectSetHelper(
  engravingMap: Map<string, number>,
  effectMap: Map<string, number>,
  accessory: AccessoryType
) {
  let currentEngraving1 = engravingMap.get(accessory.engraving1.name);
  let currentEngraving2 = engravingMap.get(accessory.engraving2.name);
  const currentEffect1 = effectMap.get(accessory.effect1.name) ?? 0;
  const currentEffect2 = effectMap.get(accessory.effect2.name) ?? 0;
  // if not a stub and both engravings are empty,cut
  if (
    accessory.type != AccessoryNames.Stub &&
    currentEngraving1 == undefined &&
    currentEngraving2 == undefined
  ) {
    //console.log("cutted!");
    //console.log(accessory.id);
    //console.log(accessory.engraving1.name);
    //console.log(accessory.engraving2.name);
    return [-1, -1, -1, -1];
  }
  if (currentEngraving1 == undefined) currentEngraving1 = 0;
  if (currentEngraving2 == undefined) currentEngraving2 = 0;
  engravingMap.set(
    accessory.engraving1.name,
    currentEngraving1 + accessory.engraving1.nodes
  );
  engravingMap.set(
    accessory.engraving2.name,
    currentEngraving2 + accessory.engraving2.nodes
  );
  effectMap.set(
    accessory.effect1.name,
    currentEffect1 + accessory.effect1.value
  );
  effectMap.set(
    accessory.effect2.name,
    currentEffect2 + accessory.effect2.value
  );
  return [currentEngraving1, currentEngraving2, currentEffect1, currentEffect2];
}

export type EquipStats = {
  engraving1: number;
  engraving2: number;
  effect1: number;
  effect2: number;
  type: AccessoryNames;
};
const neckLanceStat: EquipStats = {
  engraving1: 6,
  engraving2: 3,
  effect1: 500,
  effect2: 500,
  type: AccessoryNames.NeckLance,
};
const ringStat: EquipStats = {
  engraving1: 6,
  engraving2: 3,
  effect1: 200,
  effect2: 0,
  type: AccessoryNames.Ring,
};
const earringStat: EquipStats = {
  engraving1: 6,
  engraving2: 3,
  effect1: 300,
  effect2: 0,
  type: AccessoryNames.Earring,
};
const abilityStoneStat: EquipStats = {
  engraving1: 9,
  engraving2: 9,
  effect1: 0,
  effect2: 0,
  type: AccessoryNames.AbilityStone,
};
const engravingStat: EquipStats = {
  engraving1: 12,
  engraving2: 0,
  effect1: 0,
  effect2: 0,
  type: AccessoryNames.Engraving,
};
export function generateEquips(
  generateTemplateP: EquipStats,
  targetEngravingsP: (typeof engravingNames)[number][],
  targetEffectsP: (typeof effectNames)[number][]
): AccessoryType[] {
  let stubEngraving: EngravingType = {
    name: "stub",
    nodes: 0,
  };
  let stubEffect: EffectType = {
    name: "stub",
    value: 0,
  };
  let generateTemplate = cloneDeep(generateTemplateP);
  let equip: AccessoryType = {
    engraving1: cloneDeep(stubEngraving),
    engraving2: cloneDeep(stubEngraving),
    effect1: cloneDeep(stubEffect),
    effect2: cloneDeep(stubEffect),
    type: generateTemplate.type,
  };
  let targetEngravings = targetEngravingsP.slice(0);
  let targetEffects = targetEffectsP.slice(0);
  if (targetEngravings.length == 0) {
    generateTemplate.engraving1 = 0;
    generateTemplate.engraving2 = 0;
  }
  if (targetEffects.length == 0) {
    generateTemplate.effect1 = 0;
    generateTemplate.effect2 = 0;
  }
  while (targetEngravings.length < 2) targetEngravings.push("stub");
  while (targetEffects.length < 2) targetEffects.push("stub");
  console.log(targetEngravings);
  console.log(targetEffects);
  const targetEngraving1 = generateTemplate.engraving1
    ? targetEngravings
    : [stubEngraving.name];
  const targetEngraving2 = generateTemplate.engraving2
    ? targetEngravings
    : [stubEngraving.name];
  const targetEffect1 = generateTemplate.effect1
    ? targetEffects
    : [stubEffect.name];
  const targetEffect2 = generateTemplate.effect2
    ? targetEffects
    : [stubEffect.name];
  //console.log(targetEngraving1, targetEngraving2, targetEffect1, targetEffect2);
  let generatedEquips: AccessoryType[] = [];

  for (const [engIndex1, engraving1] of targetEngraving1.entries()) {
    equip.engraving1.name = engraving1;
    equip.engraving1.nodes = generateTemplate.engraving1;
    let eng2StartIndex = 0;
    if (
      generateTemplate.engraving1 > 0 &&
      generateTemplate.engraving1 == generateTemplate.engraving2
    ) {
      eng2StartIndex = engIndex1 + 1;
    }
    for (
      let engIndex2 = eng2StartIndex;
      engIndex2 < targetEngraving2.length;
      engIndex2++
    ) {
      const engraving2 = targetEngraving2[engIndex2];
      if (engraving1 != engraving2 || generateTemplate.engraving2 == 0) {
        equip.engraving2.name = engraving2;
        equip.engraving2.nodes = generateTemplate.engraving2;
        for (const [efIndex1, effect1] of targetEffect1.entries()) {
          equip.effect1.name = effect1;
          equip.effect1.value = generateTemplate.effect1;
          let ef2StartIndex = 0;
          if (
            generateTemplate.effect1 > 0 &&
            generateTemplate.effect1 == generateTemplate.effect2
          ) {
            ef2StartIndex = efIndex1 + 1;
          }
          for (let i = ef2StartIndex; i < targetEffect2.length; i++) {
            const effect2 = targetEffect2[i];
            equip.effect2.name = effect2;
            equip.effect2.value = generateTemplate.effect2;
            if (effect1 != effect2 || generateTemplate.effect2 == 0)
              generatedEquips.push(cloneDeep(equip));
          }
        }
      }
    }
  }
  return generatedEquips;
}
export function getCC() {
  return cc;
}
