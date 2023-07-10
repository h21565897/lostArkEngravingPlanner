import Adrenaline from "@/assets/Engraving/Adrenaline.png";
import AmbushMaster from "@/assets/Engraving/AmbushMaster.png";
import CursedDoll from "@/assets/Engraving/CursedDoll.png";
import Grudge from "@/assets/Engraving/Grudge.png";
import HitMaster from "@/assets/Engraving/HitMaster.png";
import KeenBluntWeapon from "@/assets/Engraving/KeenBluntWeapon.png";
import PeaceMaker from "@/assets/Engraving/PeaceMaker.png";
import DefaultEngraving from "@/assets/Engraving.png";

import AbilityStone from "@/assets/AbilityStone.png";
import Earring from "@/assets/Earring.png";
import Necklance from "@/assets/Necklance.png";
import Ring from "@/assets/Ring.png";
import DefaultSlot from "@/assets/DefaultSlot.png";
export const getEngravingImage = (name: string) => {
  switch (name) {
    case "Adrenaline":
      return Adrenaline;
    case "Ambush Master":
      return AmbushMaster;
    case "Cursed Doll":
      return CursedDoll;
    case "Grudge":
      return Grudge;
    case "Hit Master":
      return HitMaster;
    case "Keen Blunt Weapon":
      return KeenBluntWeapon;
    case "PeaceMaker":
      return PeaceMaker;
    default:
      return DefaultEngraving;
  }
};

export const getAccessoryImage = (name: string) => {
  switch (name) {
    case "Earring":
      return Earring;
    case "NeckLance":
      return Necklance;
    case "Ring":
      return Ring;
    case "AbilityStone":
      return AbilityStone;
    case "Engraving":
      return DefaultEngraving;
    default:
      return DefaultSlot;
  }
};
