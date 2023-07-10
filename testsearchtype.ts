import { solveEngraving } from "./common/EngravingSolver";
import fs from "fs";
import { AccessoryType } from "./types";
import { json } from "stream/consumers";
let accessories: AccessoryType[] = [];
fs.readFile("./mocks.json", "utf8", (err, jsonString) => {
  accessories = JSON.parse(jsonString);
  console.log(accessories);
});

// const results = solveEngraving({
//   targetEngravings: [
//     {
//       name: "Grudge",
//       nodes: 15,
//     },
//     {
//       name: "Hit Master",
//       nodes: 15,
//     },
//     {
//       name: "Keen Blunt Weapon",
//       nodes: 15,
//     },
//     {
//       name: "Adrenaline",
//       nodes: 15,
//     },
//   ],
//   targetEffects: [
//     {
//       name: "crit",
//       value: 100,
//     },
//     {
//       name: "spec",
//       value: 100,
//     },
//   ],
//   availableAblityStones: someAbilityStones,
//   availableEarrings: someEarrings,
//   availableNecklaces: someNecklaces,
//   availableRings: someRings,
//   availableEngravings: someEngravings,
// });
